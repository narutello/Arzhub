import { useState, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { CurrencyRow, HeroCard } from "@/components/currency-row";
import { ChangeBadge, CodeMark, PriceValue } from "@/components/price";
import { Button } from "@/components/ui/button";
import {
  computeMarketPulse,
  PULSE_CODES,
  type MarketPulse,
  type PulseLevel,
} from "@/lib/market-pulse";
import type { Quote, Snapshot } from "@/lib/types";
import {
  formatPercent,
  formatRelativeFa,
  formatTehranDate,
  formatTehranTime,
  formatToman,
} from "@/lib/format";

function rangePct(q: Quote) {
  if (q.high == null || q.low == null || q.low <= 0) return 0;
  return ((q.high - q.low) / q.low) * 100;
}

const SUMMARY_CODES = PULSE_CODES;

function buildSummaryText(quotes: Quote[], fetchedAt: string): string {
  const byCode = Object.fromEntries(quotes.map((q) => [q.code, q]));
  const lines: string[] = ["خلاصه بازار آزاد — ارزهاب"];

  for (const code of SUMMARY_CODES) {
    const q = byCode[code];
    if (!q) continue;
    lines.push(
      `${q.currency.nameFa}: ${formatToman(q.price, q.currency.decimals)} تومان (${formatPercent(q.changePercent)})`,
    );
  }

  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  if (top && top.changePercent > 0) {
    lines.push(
      `بیشترین رشد: ${top.currency.nameFa} (${formatPercent(top.changePercent)})`,
    );
  }
  if (bottom && bottom.changePercent < 0) {
    lines.push(
      `بیشترین افت: ${bottom.currency.nameFa} (${formatPercent(bottom.changePercent)})`,
    );
  }

  lines.push(
    `${formatTehranDate(fetchedAt)} — ${formatTehranTime(fetchedAt)}`,
  );
  return lines.join("\n");
}

function pulseBadgeClass(level: PulseLevel): string {
  switch (level) {
    case "calm":
      return "bg-up/12 text-up";
    case "turbulent":
      return "bg-down/12 text-down";
    case "normal":
      return "bg-card-2 text-muted";
    case "forming":
    default:
      return "bg-card-2 text-subtle";
  }
}

function statusBorderClass(open: boolean, level: PulseLevel): string {
  if (!open) return "border-border";
  if (level === "turbulent") return "border-down/25";
  if (level === "calm") return "border-up/25";
  return "border-border";
}

/** Short source chip from full sourceName. */
function sourceChip(sourceName: string): string {
  const n = sourceName.toLowerCase();
  if (n.includes("bonbast")) return "Bonbast";
  if (n.includes("tgju") || n.includes("طلا و ارز")) return "TGJU";
  return sourceName.length > 18 ? `${sourceName.slice(0, 16)}…` : sourceName;
}

/** One human line for the day — not a table. */
function marketNarrative(
  open: boolean,
  pulse: MarketPulse,
  quotes: Quote[],
): string {
  if (!open) {
    return "بازار امروز بسته است؛ آخرین نرخ معاملاتی نمایش داده می‌شود.";
  }
  if (pulse.level === "forming") {
    return "داده‌های جلسه هنوز در حال شکل‌گیری است.";
  }

  const byCode = new Map(quotes.map((q) => [q.code, q]));
  const core = PULSE_CODES.map((c) => byCode.get(c)).filter(
    (q): q is Quote => Boolean(q),
  );
  const movers = [...core].sort(
    (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent),
  );
  const lead = movers[0];

  if (pulse.level === "turbulent") {
    if (lead && Math.abs(lead.changePercent) >= 0.15) {
      return `دامنهٔ حرکت امروز بالاست؛ ${lead.currency.nameFa} بیشترین جابه‌جایی را داشته است.`;
    }
    return "دامنهٔ حرکت نمادهای اصلی امروز بالاتر از حالت عادی است.";
  }
  if (pulse.level === "calm") {
    return "بازار نسبتاً آرام است؛ دامنهٔ حرکت نمادهای اصلی محدود بوده است.";
  }
  if (lead && Math.abs(lead.changePercent) >= 0.2) {
    const dir =
      lead.changePercent > 0 ? "مثبت" : lead.changePercent < 0 ? "منفی" : "ثابت";
    return `نوسان در بازهٔ عادی؛ ${lead.currency.nameFa} ${dir} (${formatPercent(lead.changePercent)}).`;
  }
  return "نوسان نمادهای اصلی در بازهٔ عادی روزهای اخیر است.";
}

/** Three dots: intensity grows with pulse level. */
function PulseDots({ level }: { level: PulseLevel }) {
  const active =
    level === "turbulent" ? 3 : level === "normal" ? 2 : level === "calm" ? 1 : 0;
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={
            i < active
              ? level === "turbulent"
                ? "size-1.5 rounded-full bg-down"
                : level === "calm"
                  ? "size-1.5 rounded-full bg-up"
                  : "size-1.5 rounded-full bg-muted"
              : "size-1.5 rounded-full bg-border"
          }
        />
      ))}
    </span>
  );
}

export function DailySummary({ snapshot }: { snapshot: Snapshot }) {
  const [copied, setCopied] = useState(false);
  const byCode = Object.fromEntries(
    snapshot.quotes.map((q) => [q.code, q]),
  );
  const highlights = SUMMARY_CODES.map((c) => byCode[c]).filter(
    Boolean,
  ) as Quote[];

  const sorted = [...snapshot.quotes].sort(
    (a, b) => b.changePercent - a.changePercent,
  );
  const topGainer = sorted.find((q) => q.changePercent > 0) ?? null;
  const topLoser =
    [...sorted].reverse().find((q) => q.changePercent < 0) ?? null;

  async function copySummary() {
    const text = buildSummaryText(snapshot.quotes, snapshot.fetchedAt);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  if (highlights.length === 0) return null;

  return (
    <section className="rounded-xl bg-card p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">خلاصه امروز</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs"
          onClick={() => void copySummary()}
          aria-label="کپی خلاصه بازار"
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              کپی شد
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              کپی برای اشتراک
            </>
          )}
        </Button>
      </div>

      <ul className="space-y-2">
        {highlights.map((q) => (
          <li
            key={q.code}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden>{q.currency.flag}</span>
              <span className="truncate font-medium">{q.currency.nameFa}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 tabular-nums">
              <span className="font-medium">
                <PriceValue value={q.price} decimals={q.currency.decimals} />
              </span>
              <ChangeBadge quote={q} />
            </span>
          </li>
        ))}
      </ul>

      {(topGainer || topLoser) && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted">
          {topGainer ? (
            <p>
              بیشترین رشد:{" "}
              <span className="text-up">
                {topGainer.currency.nameFa}{" "}
                ({formatPercent(topGainer.changePercent)})
              </span>
            </p>
          ) : null}
          {topLoser ? (
            <p>
              بیشترین افت:{" "}
              <span className="text-down">
                {topLoser.currency.nameFa}{" "}
                ({formatPercent(topLoser.changePercent)})
              </span>
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}

export function MetalsSection({ quotes }: { quotes: Quote[] }) {
  const metals = quotes.filter((q) => q.currency.kind === "metal");
  if (metals.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-base font-medium">طلا و سکه</h2>
        <span className="text-xs text-subtle">قیمت به تومان</span>
      </div>
      <div className="divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card">
        {metals.map((quote) => (
          <CurrencyRow key={quote.code} quote={quote} />
        ))}
      </div>
    </section>
  );
}

export function SourceBar({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <p>
        منبع:{" "}
        <a
          href={snapshot.sourceUrl}
          className="text-foreground underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {snapshot.sourceName}
        </a>
      </p>
      <p>
        آخرین به‌روزرسانی: {formatTehranDate(snapshot.fetchedAt)}،{" "}
        {formatTehranTime(snapshot.fetchedAt)}
      </p>
    </div>
  );
}

export function MarketStatus({ snapshot }: { snapshot: Snapshot }) {
  const [openDetail, setOpenDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const open = snapshot.marketOpen;
  const pulse = computeMarketPulse(snapshot.quotes, {
    marketOpen: snapshot.marketOpen,
  });
  const relative = formatRelativeFa(snapshot.fetchedAt);
  const absolute = `${formatTehranDate(snapshot.fetchedAt)} · ${formatTehranTime(snapshot.fetchedAt)}`;
  const narrative = marketNarrative(open, pulse, snapshot.quotes);
  const chip = sourceChip(snapshot.sourceName);

  async function copyStatus(e: MouseEvent) {
    e.stopPropagation();
    const text = [
      "بازار آزاد تهران",
      open ? "باز · آخرین نرخ جاری" : "تعطیل · آخرین جلسه",
      `نبض · ${pulse.label}`,
      absolute,
      narrative,
    ].join(" · ");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className={`rounded-xl border bg-card px-4 py-3 shadow-card ${statusBorderClass(open, pulse.level)}`}
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <span className="text-sm font-semibold tracking-tight">
          بازار آزاد تهران
        </span>
        <span
          className={
            open
              ? "inline-flex items-center gap-1.5 rounded-full bg-up/12 px-2 py-0.5 text-xs text-up"
              : "inline-flex items-center gap-1.5 rounded-full bg-card-2 px-2 py-0.5 text-xs text-muted"
          }
        >
          <span
            className={
              open
                ? "size-1.5 shrink-0 rounded-full bg-up"
                : "size-1.5 shrink-0 rounded-full bg-subtle"
            }
            aria-hidden
          />
          {open ? "باز · نرخ جاری" : "تعطیل · آخرین جلسه"}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${pulseBadgeClass(pulse.level)}`}
        >
          <PulseDots level={pulse.level} />
          <span>نبض · {pulse.label}</span>
        </span>
        <a
          href={snapshot.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-card-2 px-2 py-0.5 text-[0.6875rem] text-subtle transition-colors hover:text-foreground"
          title={snapshot.sourceName}
        >
          {chip}
        </a>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-subtle">
        <time dateTime={snapshot.fetchedAt} className="tabular-nums">
          {absolute}
        </time>
        <span aria-hidden className="text-border">
          ·
        </span>
        <span className="text-muted">{relative}</span>
        <button
          type="button"
          onClick={(e) => void copyStatus(e)}
          className="ms-auto inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-subtle transition-colors hover:bg-card-2 hover:text-foreground"
          aria-label="کپی وضعیت بازار"
        >
          {copied ? (
            <>
              <Check className="size-3" />
              <span>کپی شد</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span className="hidden sm:inline">کپی</span>
            </>
          )}
        </button>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted">{narrative}</p>

      <button
        type="button"
        className="mt-2 text-xs text-subtle underline-offset-2 hover:text-foreground hover:underline"
        onClick={() => setOpenDetail((v) => !v)}
        aria-expanded={openDetail}
        aria-controls="market-status-detail"
      >
        {openDetail ? "بستن جزئیات" : "جزئیات نبض و محاسبه"}
      </button>

      {openDetail ? (
        <div
          id="market-status-detail"
          className="mt-2 space-y-1.5 rounded-lg bg-card-2 px-3 py-2.5 text-xs leading-relaxed text-muted"
          role="note"
        >
          <p>{pulse.hint}</p>
          {pulse.score != null ? (
            <p className="tabular-nums text-subtle">
              میانگین دامنهٔ نمادهای اصلی: حدود{" "}
              {pulse.score.toLocaleString("fa-IR", {
                maximumFractionDigits: 1,
              })}
              ٪
            </p>
          ) : null}
          <p className="text-subtle">
            نبض از میانگین دامنهٔ روزانهٔ دلار، یورو، درهم، طلای ۱۸ و سکه امامی
            نسبت به قیمت میانی همان روز به‌دست می‌آید.
          </p>
          {snapshot.note ? (
            <p className="border-t border-border pt-1.5">{snapshot.note}</p>
          ) : (
            <p className="border-t border-border pt-1.5 text-subtle">
              قیمت‌ها به تومان است. هر تومان برابر ۱۰ ریال.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function MoverList({
  title,
  quotes,
  empty,
}: {
  title: string;
  quotes: Quote[];
  empty: string;
}) {
  return (
    <section className="rounded-xl bg-card p-4 shadow-card">
      <h2 className="mb-3 text-sm font-medium">{title}</h2>
      {quotes.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {quotes.map((q) => (
            <li key={q.code}>
              <Link
                to="/currencies/$code"
                params={{ code: q.code.toLowerCase() }}
                className="flex items-center gap-3 rounded-md py-1"
              >
                <CodeMark code={q.code} />
                <span className="min-w-0 flex-1 truncate text-sm">
                  {q.currency.nameFa}
                </span>
                <div className="text-end">
                  <PriceValue
                    value={q.price}
                    decimals={q.currency.decimals}
                    className="block text-sm font-medium"
                  />
                  <ChangeBadge quote={q} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Movers({ quotes }: { quotes: Quote[] }) {
  const gainers = quotes
    .filter((q) => q.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 4);
  const losers = quotes
    .filter((q) => q.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 4);

  if (gainers.length === 0 && losers.length === 0) {
    const volatile = [...quotes]
      .sort((a, b) => rangePct(b) - rangePct(a))
      .slice(0, 4);
    return (
      <MoverList
        title="بیشترین نوسان روزانه"
        quotes={volatile}
        empty="نوسان معناداری ثبت نشده است."
      />
    );
  }

  const columns = [];
  if (gainers.length) {
    columns.push(
      <MoverList
        key="up"
        title="بیشترین افزایش"
        quotes={gainers}
        empty="امروز افزایشی ثبت نشده است."
      />,
    );
  }
  if (losers.length) {
    columns.push(
      <MoverList
        key="down"
        title="بیشترین کاهش"
        quotes={losers}
        empty="امروز کاهشی ثبت نشده است."
      />,
    );
  }
  return (
    <div
      className={`grid gap-3 ${columns.length > 1 ? "md:grid-cols-2" : ""}`}
    >
      {columns}
    </div>
  );
}

export function FeaturedGrid({ quotes }: { quotes: Quote[] }) {
  const featured = quotes.filter((q) => q.currency.featured).slice(0, 3);
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {featured.map((q) => (
        <HeroCard key={q.code} quote={q} />
      ))}
    </div>
  );
}
