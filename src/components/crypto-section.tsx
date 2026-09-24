import { Link } from "@tanstack/react-router";
import { useCryptoUnit, type CryptoUnit } from "@/lib/crypto-unit";
import { CodeMark, PriceValue } from "@/components/price";
import type { Quote } from "@/lib/types";

export function CryptoSection({ quotes }: { quotes: Quote[] }) {
  const cryptos = quotes.filter((q) => q.currency.kind === "crypto");
  const { unit, setUnit } = useCryptoUnit();
  if (cryptos.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium">رمزارز</h2>
          <Link
            to="/crypto"
            className="text-xs text-accent underline-offset-4 hover:underline"
          >
            جزئیات
          </Link>
        </div>
        <UnitSwitch unit={unit} onChange={setUnit} />
      </div>
      <div className="divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card">
        {cryptos.map((quote) => (
          <CryptoRow key={quote.code} quote={quote} unit={unit} />
        ))}
      </div>
    </section>
  );
}

function UnitSwitch({
  unit,
  onChange,
}: {
  unit: CryptoUnit;
  onChange: (u: CryptoUnit) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg bg-card-2 p-0.5 text-xs"
      role="group"
      aria-label="واحد نمایش رمزارز"
    >
      {(
        [
          ["IRT", "تومان"],
          ["USD", "دلار"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={
            unit === id
              ? "rounded-md bg-card px-2.5 py-1 font-medium text-foreground shadow-sm"
              : "rounded-md px-2.5 py-1 text-muted"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CryptoRow({ quote, unit }: { quote: Quote; unit: CryptoUnit }) {
  const isUsd = unit === "USD";
  const price =
    isUsd && quote.priceUsd != null && quote.priceUsd > 0
      ? quote.priceUsd
      : quote.price;
  const decimals = isUsd
    ? (quote.currency.decimalsUsd ?? 2)
    : quote.currency.decimals;
  const suffix = isUsd ? "دلار" : "تومان";

  return (
    <Link
      to="/currencies/$code"
      params={{ code: quote.code.toLowerCase() }}
      className="flex items-center gap-3 px-3 py-3 transition-colors hover:bg-card-2/60"
    >
      <CodeMark code={quote.code} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{quote.currency.nameFa}</div>
        <div className="text-xs text-subtle">
          {quote.currency.flag} {quote.currency.nameEn}
        </div>
      </div>
      <div className="text-end">
        <div className="text-sm font-medium tabular-nums">
          <PriceValue value={price} decimals={decimals} />
          <span className="ms-1 text-xs font-normal text-subtle">{suffix}</span>
        </div>
        <span
          className={
            quote.direction === "up"
              ? "text-xs text-up"
              : quote.direction === "down"
                ? "text-xs text-down"
                : "text-xs text-muted"
          }
          dir="ltr"
        >
          {quote.changePercent > 0 ? "+" : ""}
          {quote.changePercent.toFixed(2)}%
        </span>
      </div>
    </Link>
  );
}
