import { Link } from "@tanstack/react-router";
import { ChangeBadge, PriceValue } from "@/components/price";
import { CopyPriceButton } from "@/components/copy-price-button";
import { StarButton } from "@/components/star-button";
import type { Quote } from "@/lib/types";
import { formatToman } from "@/lib/format";

export function CurrencyRow({ quote }: { quote: Quote }) {
  const unit = quote.currency.quoteUnitLabel;
  return (
    <Link
      to="/currencies/$code"
      params={{ code: quote.code.toLowerCase() }}
      className="flex min-h-[4.25rem] items-center gap-3 px-3 py-2.5 transition-colors duration-150 hover:bg-card-2/50 active:bg-card-2/70"
    >
      <StarButton code={quote.code} />
      <span className="shrink-0 text-xl leading-none" aria-hidden>
        {quote.currency.flag}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-medium leading-snug">
            {quote.currency.nameFa}
          </p>
          <div className="flex items-center gap-0.5">
            <p className="text-[1.0625rem] font-semibold tabular-nums tracking-tight">
              <PriceValue
                value={quote.price}
                decimals={quote.currency.decimals}
              />
            </p>
            <CopyPriceButton quote={quote} />
          </div>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-3 text-xs text-muted">
          <span className="tabular-nums">
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
      className="flex flex-col gap-3.5 rounded-xl bg-card p-4 shadow-card transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(28,36,48,0.08),0_4px_16px_rgba(28,36,48,0.06)] active:translate-y-0 dark:hover:shadow-[0_0_0_1px_rgba(240,235,227,0.1),0_4px_20px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-2xl leading-none" aria-hidden>
            {quote.currency.flag}
          </span>
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-subtle">
              {quote.code}
            </p>
            <h2 className="truncate text-base font-medium leading-snug">
              {quote.currency.nameFa}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <CopyPriceButton quote={quote} />
          <StarButton code={quote.code} />
        </div>
      </div>

      <p className="text-[1.75rem] font-semibold leading-none tracking-tight sm:text-3xl">
        <PriceValue value={quote.price} decimals={quote.currency.decimals} />
        <span className="ms-1.5 text-sm font-medium text-muted">تومان</span>
      </p>

      <div className="flex items-center justify-between gap-3 text-sm">
        <ChangeBadge quote={quote} />
        {quote.high != null && quote.low != null ? (
          <span className="shrink-0 text-xs tabular-nums text-muted">
            <span className="opacity-70">بازه </span>
            {formatToman(quote.low, quote.currency.decimals)}
            <span className="mx-0.5 opacity-50">–</span>
            {formatToman(quote.high, quote.currency.decimals)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
