import { a as CURRENCY_BY_CODE, i as CURRENCIES, n as CHART_RANGES } from "./types-CWELa7eF.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-B-G6ISdX.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
var TGJU_LIVE = "https://call.tgju.org/ajax.json";
var TGJU_HISTORY = "https://api.tgju.org/v1/market/indicator/summary-table-data/";
var BONBAST_HOME = "https://www.bonbast.com/";
var RATES_TTL_MS = 9e4;
var CHART_TTL_MS = 18e5;
var ratesCache = null;
var chartCache = /* @__PURE__ */ new Map();
function parseNum(raw) {
	if (typeof raw === "number") return raw;
	if (typeof raw !== "string") return NaN;
	const cleaned = raw.replace(/,/g, "").replace(/[^\d.-]/g, "");
	return Number(cleaned);
}
function rialToToman(rial) {
	return rial / 10;
}
function tehranNow() {
	return /* @__PURE__ */ new Date();
}
function isSameTehranDay(iso) {
	if (!iso) return false;
	try {
		const fmt = new Intl.DateTimeFormat("en-CA", {
			timeZone: "Asia/Tehran",
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		});
		return fmt.format(new Date(iso)) === fmt.format(tehranNow());
	} catch {
		return false;
	}
}
function directionOf(change) {
	if (change > 0) return "up";
	if (change < 0) return "down";
	return "flat";
}
async function fetchJson(url, init) {
	const res = await fetch(url, {
		...init,
		headers: {
			"User-Agent": UA,
			Accept: "application/json,text/javascript,*/*;q=0.8",
			...init?.headers ?? {}
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!res.ok) throw new Error(`منبع داده پاسخ نامعتبر داد (${res.status})`);
	return res.json();
}
function quotesFromTgju(current) {
	const quotes = [];
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
			direction
		});
	}
	return quotes;
}
async function fetchTgjuSnapshot() {
	const current = (await fetchJson(TGJU_LIVE)).current;
	if (!current || typeof current !== "object") throw new Error("ساختار دادهٔ TGJU ناقص بود");
	const quotes = quotesFromTgju(current);
	if (quotes.length < 6) throw new Error("تعداد ارزهای دریافتی کافی نبود");
	const marketOpen = isSameTehranDay(quotes.map((q) => q.updatedAt).filter((d) => Boolean(d)).sort().at(-1) ?? null);
	return {
		quotes,
		sourceName: "شبکه اطلاع‌رسانی طلا و ارز (TGJU)",
		sourceUrl: "https://www.tgju.org/",
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		marketOpen,
		note: marketOpen ? null : "بازار امروز تعطیل است؛ آخرین نرخ معاملاتی نمایش داده می‌شود."
	};
}
async function fetchBonbastSnapshot() {
	const home = await fetch(BONBAST_HOME, {
		headers: {
			"User-Agent": UA,
			Accept: "text/html,application/xhtml+xml"
		},
		signal: AbortSignal.timeout(12e3)
	});
	if (!home.ok) throw new Error("Bonbast در دسترس نبود");
	const param = (await home.text()).match(/param:\s*"([^"]+)"/)?.[1];
	if (!param) throw new Error("نشانهٔ Bonbast پیدا نشد");
	const cookie = (home.headers.getSetCookie?.() ?? []).map((c) => c.split(";")[0]).join("; ");
	const body = new URLSearchParams({ param });
	const json = await fetchJson("https://www.bonbast.com/json", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"X-Requested-With": "XMLHttpRequest",
			Referer: BONBAST_HOME,
			Origin: "https://www.bonbast.com",
			Cookie: cookie
		},
		body
	});
	if (json.rest || !json.usd1) throw new Error("Bonbast نرخ‌ها را برنگرداند");
	const quotes = [];
	for (const currency of CURRENCIES) {
		if (!currency.bonbastKey) continue;
		const sell = parseNum(json[`${currency.bonbastKey}1`]);
		if (!Number.isFinite(sell) || sell <= 0) continue;
		let price = sell;
		if (currency.code === "JPY") price = sell * 10;
		quotes.push({
			code: currency.code,
			currency,
			price,
			change: 0,
			changePercent: 0,
			high: null,
			low: null,
			updatedAt: json.last_modified ? new Date(json.last_modified).toISOString() : null,
			direction: "flat"
		});
	}
	if (quotes.length < 6) throw new Error("تعداد ارزهای Bonbast کافی نبود");
	return {
		quotes,
		sourceName: "Bonbast — بازار آزاد تهران",
		sourceUrl: "https://www.bonbast.com/",
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		marketOpen: true,
		note: null
	};
}
async function loadFreshSnapshot() {
	try {
		return await fetchTgjuSnapshot();
	} catch (primary) {
		try {
			return await fetchBonbastSnapshot();
		} catch {
			const reason = primary instanceof Error ? primary.message : "خطای ناشناخته";
			throw new Error(`قیمت‌ها به‌روزرسانی نشد: ${reason}`);
		}
	}
}
async function fetchSnapshot() {
	if (ratesCache && Date.now() - ratesCache.at < RATES_TTL_MS) return {
		ok: true,
		stale: false,
		error: null,
		snapshot: ratesCache.value
	};
	try {
		const snapshot = await loadFreshSnapshot();
		ratesCache = {
			at: Date.now(),
			value: snapshot
		};
		return {
			ok: true,
			stale: false,
			error: null,
			snapshot
		};
	} catch (err) {
		const error = err instanceof Error ? err.message : "قیمت‌ها به‌روزرسانی نشد.";
		if (ratesCache) return {
			ok: false,
			stale: true,
			error,
			snapshot: ratesCache.value
		};
		return {
			ok: false,
			stale: false,
			error,
			snapshot: null
		};
	}
}
function parseHistoryRow(row) {
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
		close
	};
}
async function fetchChartData(code, range) {
	const currency = CURRENCY_BY_CODE[code.toUpperCase()];
	if (!currency) return {
		ok: false,
		error: "این ارز پشتیبانی نمی‌شود.",
		code,
		range,
		sourceName: "TGJU",
		points: []
	};
	const key = `${currency.code}:${range}`;
	const cached = chartCache.get(key);
	if (cached && Date.now() - cached.at < CHART_TTL_MS) return cached.value;
	const spec = CHART_RANGES.find((r) => r.id === range) ?? CHART_RANGES[1];
	try {
		const payload = await fetchJson(`${TGJU_HISTORY}${currency.tgjuKey}?start=0&length=${spec.days}`);
		const points = (Array.isArray(payload.data) ? payload.data : []).map(parseHistoryRow).filter((p) => p !== null).reverse();
		const result = {
			ok: points.length > 0,
			error: points.length ? null : "نمودار این بازه در دسترس نیست.",
			code: currency.code,
			range,
			sourceName: "شبکه اطلاع‌رسانی طلا و ارز (TGJU)",
			points
		};
		chartCache.set(key, {
			at: Date.now(),
			value: result
		});
		return result;
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "دریافت نمودار ناموفق بود.",
			code: currency.code,
			range,
			sourceName: "TGJU",
			points: []
		};
	}
}
var getRates_createServerFn_handler = createServerRpc({
	id: "3266bff51ec4af028e1d7d28d4b8b927550c23c7d34481a77c369b883260ebe8",
	name: "getRates",
	filename: "src/lib/market.ts"
}, (opts) => getRates.__executeServer(opts));
var getRates = createServerFn({ method: "GET" }).handler(getRates_createServerFn_handler, async () => {
	return fetchSnapshot();
});
var getChart_createServerFn_handler = createServerRpc({
	id: "e7ba96f3582fa61a1e6a4c12c9949c309908c4cad462d84783ed245a07a0ceac",
	name: "getChart",
	filename: "src/lib/market.ts"
}, (opts) => getChart.__executeServer(opts));
var getChart = createServerFn({ method: "GET" }).validator((data) => {
	const input = data ?? {};
	const code = String(input.code ?? "").toUpperCase();
	const range = input.range ?? "1m";
	const allowed = CHART_RANGES.some((r) => r.id === range);
	if (!code) throw new Error("کد ارز نامعتبر است");
	return {
		code,
		range: allowed ? range : "1m"
	};
}).handler(getChart_createServerFn_handler, async ({ data }) => {
	return fetchChartData(data.code, data.range);
});
//#endregion
export { getChart_createServerFn_handler, getRates_createServerFn_handler };
