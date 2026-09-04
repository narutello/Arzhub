import { Link } from "@tanstack/react-router";
import { ChangeBadge, CodeMark, PriceValue } from "@/components/price";
import { StarButton } from "@/components/star-button";
import type { Quote } from "@/lib/types";
import { formatToman } from "@/lib/format";

export function CurrencyRow({ quote }: { quote: Quote }) {
  const unit = quote.currency.quoteUnitLabel;
  return (
    <Link
      to="/currencies/$code"
      params={{ code: quote.code.toLowerCase() }}
      className="flex min-h-16 items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-card"
    >
      <StarButton code={quote.code} />
      <CodeMark code={quote.code} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-medium">{quote.currency.nameFa}</p>
          <p className="text-[1.05rem] font-semibold">
            <PriceValue value={quote.price} decimals={quote.currency.decimals} />
          </p>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-muted">
          <span>
            {quote.code}
            {unit ? ` · ${unit}` : null}
          </span>
          <ChangeBadge quote={quote} />
        </div>
      </div>
    </Link>
  );
}

export function HeroCard({ quote }: { quote: Quote }) {
  return (
    <Link
      to="/currencies/$code"
      params={{ code: quote.code.toLowerCase() }}
      className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-card transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted">{quote.code}</p>
          <h2 className="text-base font-medium">{quote.currency.nameFa}</h2>
        </div>
        <StarButton code={quote.code} />
      </div>
      <p className="text-3xl font-semibold leading-none tracking-tight">
        <PriceValue value={quote.price} decimals={quote.currency.decimals} />
        <span className="ms-2 text-sm font-medium text-muted">تومان</span>
      </p>
      <div className="flex items-center justify-between text-sm">
        <ChangeBadge quote={quote} />
        {quote.high != null && quote.low != null ? (
          <span className="text-xs text-muted tabular-nums">
            {formatToman(quote.low, quote.currency.decimals)} –{" "}
            {formatToman(quote.high, quote.currency.decimals)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
