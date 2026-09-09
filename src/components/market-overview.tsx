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
        آخرین به‌روزرسانی: {formatTehranDate(snapshot.fetchedAt)}،{" "}
        {formatTehranTime(snapshot.fetchedAt)}
      </p>
    </div>
  );
}

export function MarketStatus({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-3 shadow-card">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="text-[15px] font-semibold">بازار آزاد تهران</span>
        <span
          className={
            snapshot.marketOpen
              ? "rounded-full bg-up/12 px-2 py-0.5 text-[11px] font-medium text-up"
              : "rounded-full bg-card-2 px-2 py-0.5 text-[11px] font-medium text-muted"
          }
        >
          {snapshot.marketOpen ? "باز" : "بسته"}
        </span>
      </div>
      <p className="mt-1 text-[13px] text-muted">
        {snapshot.note ?? "قیمت‌ها به تومان است. هر تومان برابر ۱۰ ریال."}
      </p>
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
    <section className="overflow-hidden rounded-2xl bg-card shadow-card">
      <h2 className="border-b border-border/60 px-4 py-2.5 text-[13px] font-semibold text-muted">
        {title}
      </h2>
      {quotes.length === 0 ? (
        <p className="px-4 py-3 text-[13px] text-muted">{empty}</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {quotes.map((q) => (
            <li key={q.code}>
              <Link
                to="/currencies/$code"
                params={{ code: q.code.toLowerCase() }}
                className="flex items-center gap-3 px-4 py-2.5 active:bg-card-2/50"
              >
                <CodeMark code={q.code} />
                <span className="min-w-0 flex-1 truncate text-[14px]">
                  {q.currency.nameFa}
                </span>
                <div className="text-end">
                  <PriceValue
                    value={q.price}
                    decimals={q.currency.decimals}
                    className="block text-[15px] font-semibold"
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
  const featured = quotes.filter((q) => q.currency.featured).slice(0, 6);
  return (
    <div className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {featured.map((q) => (
        <HeroCard key={q.code} quote={q} />
      ))}
    </div>
  );
}
