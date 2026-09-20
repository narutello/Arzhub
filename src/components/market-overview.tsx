import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy } from "lucide-react";
import { CurrencyRow, HeroCard } from "@/components/currency-row";
import { ChangeBadge, CodeMark, PriceValue } from "@/components/price";
import { Button } from "@/components/ui/button";
import type { Quote, Snapshot } from "@/lib/types";
import {
  formatPercent,
  formatTehranDate,
  formatTehranTime,
  formatToman,
} from "@/lib/format";

function rangePct(q: Quote) {
  if (q.high == null || q.low == null || q.low <= 0) return 0;
  return ((q.high - q.low) / q.low) * 100;
}

const SUMMARY_CODES = ["USD", "EUR", "AED", "XAU18", "SEKEE"] as const;

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
  return (
    <div className="rounded-xl bg-card px-4 py-3 shadow-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-sm font-medium">بازار آزاد تهران</span>
        <span
          className={
            snapshot.marketOpen
              ? "rounded-full bg-up/12 px-2 py-0.5 text-xs text-up"
              : "rounded-full bg-card-2 px-2 py-0.5 text-xs text-muted"
          }
        >
          {snapshot.marketOpen ? "آخرین نرخ جاری" : "تعطیل / آخرین جلسه"}
        </span>
      </div>
      {snapshot.note ? (
        <p className="mt-1 text-sm text-muted">{snapshot.note}</p>
      ) : (
        <p className="mt-1 text-sm text-muted">
          قیمت‌ها به تومان است. هر تومان برابر ۱۰ ریال.
        </p>
      )}
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
