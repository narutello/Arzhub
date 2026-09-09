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
      className="flex min-h-[3.75rem] items-center gap-3 px-3 py-2.5 active:bg-card-2/60"
    >
      <CodeMark code={quote.code} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[15px] font-semibold tracking-tight">
            {quote.currency.nameFa}
          </p>
          <p className="text-[17px] font-semibold tabular-nums tracking-tight">
            <PriceValue value={quote.price} decimals={quote.currency.decimals} />
          </p>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-3">
          <span className="truncate text-[12px] text-muted">
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
      className="flex flex-col gap-2.5 rounded-[14px] bg-card p-3. freestyle shadow-card active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <CodeMark code={quote.code} />
          <div>
            <p className="text-[12px] font-medium text-muted">{quote.code}</p>
            <h2 className="text-[15px] font-semibold tracking-tight">
              {quote.currency.nameFa}
            </h2>
          </div>
        </div>
        <StarButton code={quote.code} />
      </div>
      <p className="text-[28px] font-semibold leading-none tracking-tight tabular-nums">
        <PriceValue value={quote.price} decimals={quote.currency.decimals} />
      </p>
      <div className="flex items-center justify-between gap-2">
        <ChangeBadge quote={quote} />
        {quote.high != null && quote.low != null ? (
          <span className="text-[11px] text-muted tabular-nums">
            {formatToman(quote.low, quote.currency.decimals)} –{" "}
            {formatToman(quote.high, quote.currency.decimals)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
