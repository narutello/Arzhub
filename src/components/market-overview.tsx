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
    const volatile = [...quotes].sort((a, b) => rangePct(b) - rangePct(a)).slice(0, 4);
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
  return <div className={`grid gap-3 ${columns.length > 1 ? "md:grid-cols-2" : ""}`}>{columns}</div>;
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
