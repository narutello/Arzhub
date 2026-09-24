import { createFileRoute, Link } from "@tanstack/react-router";
import { getRates } from "@/lib/market";
import { useMarket } from "@/lib/use-market";
import { useCryptoUnit, type CryptoUnit } from "@/lib/crypto-unit";
import { CodeMark, PriceValue } from "@/components/price";
import {
  ErrorState,
  LoadingBoard,
  OfflineBanner,
  StaleBanner,
} from "@/components/states";
import type { Quote } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crypto")({
  loader: () => getRates(),
  head: () => ({
    meta: [
      { title: "رمزارز | ارزهاب" },
      {
        name: "description",
        content:
          "قیمت بیت‌کوین، اتریوم، تتر و تون به تومان و دلار — بازار آزاد.",
      },
    ],
  }),
  component: CryptoPage,
});

function CryptoPage() {
  const initial = Route.useLoaderData();
  const { snapshot, error, stale, offline, isLoading, refetch } =
    useMarket(initial);
  const { unit, setUnit } = useCryptoUnit();

  if (isLoading) return <LoadingBoard />;
  if (!snapshot) {
    return (
      <ErrorState
        message={error ?? "اتصال به منبع قیمت برقرار نشد."}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const cryptos = snapshot.quotes.filter((q) => q.currency.kind === "crypto");

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">رمزارز</h1>
          <p className="text-sm text-muted">
            بیت‌کوین، اتریوم، تتر و تون — قیمت بازار.
          </p>
        </div>
        <UnitSwitch unit={unit} onChange={setUnit} />
      </header>

      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}

      {cryptos.length === 0 ? (
        <p className="text-sm text-muted">در حال حاضر قیمت رمزارز در دسترس نیست.</p>
      ) : (
        <div className="divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card">
          {cryptos.map((quote) => (
            <CryptoDetailRow key={quote.code} quote={quote} unit={unit} />
          ))}
        </div>
      )}

      <p className="text-xs text-subtle">
        منبع: {snapshot.sourceName} — قیمت تومان از نرخ ریالی TGJU؛ قیمت دلار از
        نرخ دلاری همان منبع.
      </p>
    </div>
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
      className="inline-flex rounded-lg bg-card-2 p-0.5 text-sm"
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
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            unit === id
              ? "bg-card font-medium text-foreground shadow-sm"
              : "text-muted",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CryptoDetailRow({
  quote,
  unit,
}: {
  quote: Quote;
  unit: CryptoUnit;
}) {
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
      className="flex items-center gap-3 px-3 py-3.5 transition-colors hover:bg-card-2/60"
    >
      <CodeMark code={quote.code} />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{quote.currency.nameFa}</div>
        <div className="text-xs text-subtle">
          {quote.currency.flag} {quote.code}
        </div>
      </div>
      <div className="text-end">
        <div className="font-medium tabular-nums">
          <PriceValue value={price} decimals={decimals} />
          <span className="ms-1 text-xs font-normal text-subtle">{suffix}</span>
        </div>
        <div
          className={
            quote.direction === "up"
              ? "text-sm text-up"
              : quote.direction === "down"
                ? "text-sm text-down"
                : "text-sm text-muted"
          }
          dir="ltr"
        >
          {formatPercent(quote.changePercent)}
        </div>
      </div>
    </Link>
  );
}
