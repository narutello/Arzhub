import { Link } from "@tanstack/react-router";
import { HeroCard } from "@/components/currency-row";
import { ChangeBadge, CodeMark, PriceValue } from "@/components/price";
import type { Quote, Snapshot } from "@/lib/types";
import { formatTehranDate, formatTehranTime } from "@/lib/format";

function rangePct(q: Quote) {
  if (q.high == null || q.low == null || q.low <= 0) return 0;
  return ((q.high - q.low) / q.low) * 100;
}

export function SourceBar({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="px-1 text-center text-[12px] leading-relaxed text-muted">
      <p>
        منبع:{" "}
        <a
          href={snapshot.sourceUrl}
          className="text-accent"
          target="_blank"
          rel="noreferrer"
        >
          {snapshot.sourceName}
        </a>
      </p>
      <p className="mt-0.5">
        به‌روزرسانی: {formatTehranDate(snapshot.fetchedAt)}،{" "}
        {formatTehranTime(snapshot.fetchedAt)}
      </p>
    </div>
  );
}

export function MarketStatus({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="ios-group px-4 py-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-[15px] font-semibold tracking-tight">بازار آزاد تهران</span>
        <span
          className={
            snapshot.marketOpen
              ? "rounded-full bg-up/15 px-2 py-0.5 text-[11px] font-semibold text-up"
              : "rounded-full bg-card-2 px-2 py-0.5 text-[11px] font-semibold text-muted"
          }
        >
          {snapshot.marketOpen ? "باز" : "بسته"}
        </span>
      </div>
      {snapshot.note ? (
        <p className="mt-1 text-[13px] text-muted">{snapshot.note}</p>
      ) : (
        <p className="mt-1 text-[13px] text-muted">قیمت‌ها به تومان · هر تومان = ۱۰ ریال</p>
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
    <section>
      <h2 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <div className="ios-group">
        {quotes.length === 0 ? (
          <p className="px-4 py-4 text-[14px] text-muted">{empty}</p>
        ) : (
          <ul className="divide-y divide-[var(--separator)]">
            {quotes.map((q) => (
              <li key={q.code}>
                <Link
                  to="/currencies/$code"
                  params={{ code: q.code.toLowerCase() }}
                  className="flex items-center gap-3 px-3 py-2.5 active:bg-card-2/60"
                >
                  <CodeMark code={q.code} />
                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium">
                    {q.currency.nameFa}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <PriceValue
                      value={q.price}
                      decimals={q.currency.decimals}
                      className="text-[15px] font-semibold"
                    />
                    <ChangeBadge quote={q} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
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
    const volatile = [...quotes].sort((a, b) => rangePct(b) - rangePct(a)).slice(0, 4);
    return (
      <MoverList
        title="بیشترین نوسان"
        quotes={volatile}
        empty="نوسان معناداری ثبت نشده است."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {gainers.length ? (
        <MoverList title="بیشترین افزایش" quotes={gainers} empty="افزایشی ثبت نشده." />
      ) : null}
      {losers.length ? (
        <MoverList title="بیشترین کاهش" quotes={losers} empty="کاهشی ثبت نشده." />
      ) : null}
    </div>
  );
}

export function FeaturedGrid({ quotes }: { quotes: Quote[] }) {
  const featured = quotes.filter((q) => q.currency.featured).slice(0, 3);
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {featured.map((q) => (
        <HeroCard key={q.code} quote={q} />
      ))}
    </div>
  );
}
