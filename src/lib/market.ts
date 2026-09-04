import { createServerFn } from "@tanstack/react-start";
import { CURRENCIES, CURRENCY_BY_CODE } from "./currencies";
import type {
  ChartPoint,
  ChartRange,
  ChartResult,
  MarketResult,
  Quote,
  Snapshot,
} from "./types";
import { CHART_RANGES } from "./types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const TGJU_LIVE = "https://call.tgju.org/ajax.json";
const TGJU_HISTORY =
  "https://api.tgju.org/v1/market/indicator/summary-table-data/";
const BONBAST_HOME = "https://www.bonbast.com/";

const RATES_TTL_MS = 90_000;
const CHART_TTL_MS = 30 * 60_000;

type CacheEntry<T> = { at: number; value: T };

let ratesCache: CacheEntry<Snapshot> | null = null;
const chartCache = new Map<string, CacheEntry<ChartResult>>();

function parseNum(raw: unknown): number {
  if (typeof raw === "number") return raw;
  if (typeof raw !== "string") return NaN;
  const cleaned = raw.replace(/,/g, "").replace(/[^\d.-]/g, "");
  return Number(cleaned);
}

function rialToToman(rial: number): number {
  return rial / 10;
}

function tehranNow(): Date {
  return new Date();
}

function isSameTehranDay(iso: string | null): boolean {
  if (!iso) return false;
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return fmt.format(new Date(iso)) === fmt.format(tehranNow());
  } catch {
    return false;
  }
}

function directionOf(change: number): Quote["direction"] {
  if (change > 0) return "up";
  if (change < 0) return "down";
  return "flat";
}

type TgjuTick = {
  p?: string;
  h?: string;
  l?: string;
  d?: string | number;
  dp?: number | string;
  dt?: string;
  ts?: string;
};

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": UA,
      Accept: "application/json,text/javascript,*/*;q=0.8",
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) {
    throw new Error(`منبع داده پاسخ نامعتبر داد (${res.status})`);
  }
  return res.json();
}

function quotesFromTgju(current: Record<string, TgjuTick>): Quote[] {
  const quotes: Quote[] = [];
  for (const currency of CURRENCIES) {
    const tick = current[currency.tgjuKey];
    if (!tick) continue;
    const priceRial = parseNum(tick.p);
    if (!Number.isFinite(priceRial) || priceRial <= 0) continue;
    const highRial = parseNum(tick.h);
    const lowRial = parseNum(tick.l);
    const changeRial = parseNum(tick.d);
    const changePercent = parseNum(tick.dp);
    const price = rialToToman(priceRial);
    const change = Number.isFinite(changeRial) ? rialToToman(changeRial) : 0;
    const dt = tick.dt ?? "";
    let direction = directionOf(change);
    if (direction === "flat" && dt === "high") direction = "up";
    if (direction === "flat" && dt === "low") direction = "down";
    quotes.push({
      code: currency.code,
      currency,
      price,
      change,
      changePercent: Number.isFinite(changePercent) ? changePercent : 0,
      high: Number.isFinite(highRial) ? rialToToman(highRial) : null,
      low: Number.isFinite(lowRial) ? rialToToman(lowRial) : null,
      updatedAt: tick.ts ?? null,
      direction,
    });
  }
  return quotes;
}

async function fetchTgjuSnapshot(): Promise<Snapshot> {
  const payload = (await fetchJson(TGJU_LIVE)) as {
    current?: Record<string, TgjuTick>;
  };
  const current = payload.current;
  if (!current || typeof current !== "object") {
    throw new Error("ساختار دادهٔ TGJU ناقص بود");
  }
  const quotes = quotesFromTgju(current);
  if (quotes.length < 6) {
    throw new Error("تعداد ارزهای دریافتی کافی نبود");
  }
  const newest = quotes
    .map((q) => q.updatedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
  const marketOpen = isSameTehranDay(newest ?? null);
  return {
    quotes,
    sourceName: "شبکه اطلاع‌رسانی طلا و ارز (TGJU)",
    sourceUrl: "https://www.tgju.org/",
    fetchedAt: new Date().toISOString(),
    marketOpen,
    note: marketOpen
      ? null
      : "بازار امروز تعطیل است؛ آخرین نرخ معاملاتی نمایش داده می‌شود.",
  };
}

async function fetchBonbastSnapshot(): Promise<Snapshot> {
  const home = await fetch(BONBAST_HOME, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(12_000),
  });
  if (!home.ok) throw new Error("Bonbast در دسترس نبود");
  const html = await home.text();
  const param = html.match(/param:\s*"([^"]+)"/)?.[1];
  if (!param) throw new Error("نشانهٔ Bonbast پیدا نشد");
  const cookies = home.headers.getSetCookie?.() ?? [];
  const cookie = cookies.map((c) => c.split(";")[0]).join("; ");
  const body = new URLSearchParams({ param });
  const json = (await fetchJson("https://www.bonbast.com/json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      Referer: BONBAST_HOME,
      Origin: "https://www.bonbast.com",
      Cookie: cookie,
    },
    body,
  })) as Record<string, string>;
  if (json.rest || !json.usd1) {
    throw new Error("Bonbast نرخ‌ها را برنگرداند");
  }
  const quotes: Quote[] = [];
  for (const currency of CURRENCIES) {
    if (!currency.bonbastKey) continue;
    const sell = parseNum(json[`${currency.bonbastKey}1`]);
    if (!Number.isFinite(sell) || sell <= 0) continue;
    let price = sell;
    if (currency.code === "JPY") {
      // Bonbast lists JPY per 10 yen; we display per 100 yen.
      price = sell * 10;
    }
    quotes.push({
      code: currency.code,
      currency,
      price,
      change: 0,
      changePercent: 0,
      high: null,
      low: null,
      updatedAt: json.last_modified
        ? new Date(json.last_modified).toISOString()
        : null,
      direction: "flat",
    });
  }
  if (quotes.length < 6) throw new Error("تعداد ارزهای Bonbast کافی نبود");
  return {
    quotes,
    sourceName: "Bonbast — بازار آزاد تهران",
    sourceUrl: "https://www.bonbast.com/",
    fetchedAt: new Date().toISOString(),
    marketOpen: true,
    note: null,
  };
}

async function loadFreshSnapshot(): Promise<Snapshot> {
  try {
    return await fetchTgjuSnapshot();
  } catch (primary) {
    try {
      return await fetchBonbastSnapshot();
    } catch {
      const reason =
        primary instanceof Error ? primary.message : "خطای ناشناخته";
      throw new Error(`قیمت‌ها به‌روزرسانی نشد: ${reason}`);
    }
  }
}

export async function fetchSnapshot(): Promise<MarketResult> {
  if (ratesCache && Date.now() - ratesCache.at < RATES_TTL_MS) {
    return { ok: true, stale: false, error: null, snapshot: ratesCache.value };
  }
  try {
    const snapshot = await loadFreshSnapshot();
    ratesCache = { at: Date.now(), value: snapshot };
    return { ok: true, stale: false, error: null, snapshot };
  } catch (err) {
    const error = err instanceof Error ? err.message : "قیمت‌ها به‌روزرسانی نشد.";
    if (ratesCache) {
      return {
        ok: false,
        stale: true,
        error,
        snapshot: ratesCache.value,
      };
    }
    return { ok: false, stale: false, error, snapshot: null };
  }
}

function parseHistoryRow(row: unknown): ChartPoint | null {
  if (!Array.isArray(row) || row.length < 8) return null;
  const open = rialToToman(parseNum(row[0]));
  const low = rialToToman(parseNum(row[1]));
  const high = rialToToman(parseNum(row[2]));
  const close = rialToToman(parseNum(row[3]));
  const gDate = String(row[6] ?? "").replace(/\//g, "-");
  const jalali = String(row[7] ?? "");
  if (!Number.isFinite(close) || !gDate) return null;
  return {
    date: gDate,
    jalali,
    open: Number.isFinite(open) ? open : close,
    high: Number.isFinite(high) ? high : close,
    low: Number.isFinite(low) ? low : close,
    close,
  };
}

export async function fetchChartData(
  code: string,
  range: ChartRange,
): Promise<ChartResult> {
  const currency = CURRENCY_BY_CODE[code.toUpperCase()];
  if (!currency) {
    return {
      ok: false,
      error: "این ارز پشتیبانی نمی‌شود.",
      code,
      range,
      sourceName: "TGJU",
      points: [],
    };
  }
  const key = `${currency.code}:${range}`;
  const cached = chartCache.get(key);
  if (cached && Date.now() - cached.at < CHART_TTL_MS) {
    return cached.value;
  }
  const spec = CHART_RANGES.find((r) => r.id === range) ?? CHART_RANGES[1];
  try {
    const url = `${TGJU_HISTORY}${currency.tgjuKey}?start=0&length=${spec.days}`;
    const payload = (await fetchJson(url)) as { data?: unknown[] };
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const points = rows
      .map(parseHistoryRow)
      .filter((p): p is ChartPoint => p !== null)
      .reverse();
    const result: ChartResult = {
      ok: points.length > 0,
      error: points.length ? null : "نمودار این بازه در دسترس نیست.",
      code: currency.code,
      range,
      sourceName: "شبکه اطلاع‌رسانی طلا و ارز (TGJU)",
      points,
    };
    chartCache.set(key, { at: Date.now(), value: result });
    return result;
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "دریافت نمودار ناموفق بود.",
      code: currency.code,
      range,
      sourceName: "TGJU",
      points: [],
    };
  }
}

export const getRates = createServerFn({ method: "GET" }).handler(async () => {
  return fetchSnapshot();
});

export const getChart = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const input = (data ?? {}) as { code?: string; range?: string };
    const code = String(input.code ?? "").toUpperCase();
    const range = (input.range ?? "1m") as ChartRange;
    const allowed = CHART_RANGES.some((r) => r.id === range);
    if (!code) throw new Error("کد ارز نامعتبر است");
    return { code, range: allowed ? range : ("1m" as ChartRange) };
  })
  .handler(async ({ data }) => {
    return fetchChartData(data.code, data.range);
  });
