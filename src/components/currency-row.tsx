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
      className="flex min-h-[60px] items-center gap-3 px-3 py-2 active:bg-card-2/60"
    >
      <CodeMark code={quote.code} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[15px] font-medium leading-tight">
            {quote.currency.nameFa}
          </p>
          <p className="text-[17px] font-semibold leading-none tracking-tight">
            <PriceValue value={quote.price} decimals={quote.currency.decimals} />
          </p>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-3 text-[12px] text-muted">
          <span className="truncate">
            {quote.code}
            {unit ? ` · ${unit}` : null}
          </span>
          <ChangeBadge quote={quote} />
        </div>
      </div>
      <StarButton code={quote.code} />
    </Link>
  );
}

export function HeroCard({ quote }: { quote: Quote }) {
  return (
    <Link
      to="/currencies/$code"
      params={{ code: quote.code.toLowerCase() }}
      className="flex min-w-[148px] flex-col gap-2 rounded-2xl bg-card p-3.5 shadow-card active:opacity-90"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-muted">{quote.code}</p>
          <h2 className="truncate text-[14px] font-semibold">
            {quote.currency.nameFa}
          </h2>
        </div>
        <StarButton code={quote.code} />
      </div>
      <p className="text-[22px] font-semibold leading-none tracking-tight tabular-nums">
        <PriceValue value={quote.price} decimals={quote.currency.decimals} />
      </p>
      <div className="flex items-center justify-between gap-2 text-[12px]">
        <ChangeBadge quote={quote} />
        {quote.high != null && quote.low != null ? (
          <span className="truncate text-muted tabular-nums">
            {formatToman(quote.low, quote.currency.decimals)}–
            {formatToman(quote.high, quote.currency.decimals)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
