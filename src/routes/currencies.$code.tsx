import { createFileRoute, notFound } from "@tanstack/react-router";
import { getChart, getRates } from "@/lib/market";
import { CURRENCY_BY_CODE } from "@/lib/currencies";
import { useMarket } from "@/lib/use-market";
import { ChangeBadge, CodeMark, PriceValue } from "@/components/price";
import { Converter } from "@/components/converter";
import { PriceChart } from "@/components/price-chart";
import { StarButton } from "@/components/star-button";
import { SourceBar } from "@/components/market-overview";
import {
  ErrorState,
  LoadingBoard,
  OfflineBanner,
  StaleBanner,
} from "@/components/states";
import {
  formatPercent,
  formatSigned,
  formatTehranDate,
  formatTehranTime,
  formatToman,
} from "@/lib/format";

export const Route = createFileRoute("/currencies/$code")({
  loader: async ({ params }) => {
    const code = params.code.toUpperCase();
    const currency = CURRENCY_BY_CODE[code];
    if (!currency) throw notFound();
    const [rates, chart] = await Promise.all([
      getRates(),
      getChart({ data: { code, range: "1m" } }),
    ]);
    return { rates, chart, code };
  },
  head: ({ loaderData, params }) => {
    const code = (loaderData?.code ?? params.code).toUpperCase();
    const currency = CURRENCY_BY_CODE[code];
    const quote = loaderData?.rates.snapshot?.quotes.find((q) => q.code === code);
    const price = quote ? Math.round(quote.price).toLocaleString("en-US") : "";
    const title = currency
      ? `قیمت ${currency.nameFa} (${currency.code}) | ارزهاب`
      : "ارزهاب";
    const desc = currency
      ? `قیمت امروز ${currency.nameFa} در بازار آزاد تهران${price ? ` معادل ${price} تومان` : ""}. نمودار، نوسان روزانه و تبدیل ارز.`
      : "قیمت ارز در بازار آزاد تهران";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
      ],
    };
  },
  component: CurrencyDetail,
});

function CurrencyDetail() {
  const { rates, chart, code } = Route.useLoaderData();
  const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(rates);
  const currency = CURRENCY_BY_CODE[code];
  const quote = snapshot?.quotes.find((q) => q.code === code);

  if (isLoading) return <LoadingBoard />;
  if (!snapshot || !quote || !currency) {
    return (
      <ErrorState
        message={error ?? "نرخ این ارز در دسترس نیست."}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExchangeRateSpecification",
    name: `قیمت ${currency.nameFa}`,
    currency: currency.code,
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: Math.round(quote.price * 10),
      priceCurrency: "IRR",
      description: "نرخ بازار آزاد به ریال (نمایش سایت به تومان است)",
    },
  };

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}

      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <CodeMark code={quote.code} />
          <div>
            <p className="text-sm text-muted">{currency.nameEn}</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {currency.nameFa}
            </h1>
            <p className="text-sm text-muted">
              {currency.countryFa}
              {currency.quoteUnitLabel ? ` · ${currency.quoteUnitLabel}` : null}
            </p>
          </div>
        </div>
        <StarButton code={quote.code} />
      </header>

      <section className="rounded-xl bg-card p-5 shadow-card">
        <p className="text-xs text-muted">قیمت فعلی (تومان)</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight">
          <PriceValue value={quote.price} decimals={currency.decimals} />
        </p>
        <div className="mt-3">
          <ChangeBadge quote={quote} />
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Stat
            label="تغییر"
            value={formatSigned(quote.change, currency.decimals)}
            tone={quote.direction}
          />
          <Stat
            label="درصد"
            value={formatPercent(quote.changePercent)}
            tone={quote.direction}
          />
          <Stat
            label="بالای روز"
            value={quote.high != null ? formatToman(quote.high, currency.decimals) : "—"}
          />
          <Stat
            label="پایین روز"
            value={quote.low != null ? formatToman(quote.low, currency.decimals) : "—"}
          />
        </dl>
        {quote.updatedAt ? (
          <p className="mt-4 text-xs text-subtle">
            زمان نرخ منبع: {formatTehranDate(quote.updatedAt)}،{" "}
            {formatTehranTime(quote.updatedAt)}
          </p>
        ) : null}
      </section>

      <PriceChart quote={quote} initial={chart} />
      <Converter quotes={snapshot.quotes} defaultFrom={quote.code} defaultTo="IRT" />
      <SourceBar snapshot={snapshot} />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "flat";
}) {
  const color =
    tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-foreground";
  return (
    <div className="rounded-lg bg-card-2 px-3 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-1 font-medium tabular-nums ${color}`}>{value}</dd>
    </div>
  );
}
