import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getRates } from "@/lib/market";
import { useMarket } from "@/lib/use-market";
import { searchCurrencies } from "@/lib/currencies";
import { CurrencyRow } from "@/components/currency-row";
import {
  FeaturedGrid,
  MarketStatus,
  MetalsSection,
  Movers,
  SourceBar,
} from "@/components/market-overview";
import { CryptoSection } from "@/components/crypto-section";
import { Converter } from "@/components/converter";
import { Input } from "@/components/ui/input";
import {
  EmptySearch,
  ErrorState,
  LoadingBoard,
  OfflineBanner,
  StaleBanner,
} from "@/components/states";

export const Route = createFileRoute("/")({
  loader: () => getRates(),
  head: () => ({
    meta: [
      { title: "ارزهاب | قیمت لحظه‌ای ارز و طلا به تومان" },
      {
        name: "description",
        content:
          "نمای کلی بازار آزاد تهران: دلار، یورو، طلا، سکه و سایر نرخ‌ها به تومان.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const { snapshot, error, stale, offline, isLoading, refetch } =
    useMarket(initial);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!snapshot) return [];
    const wanted = new Set(searchCurrencies(q).map((c) => c.code));
    return snapshot.quotes.filter((quote) => wanted.has(quote.code));
  }, [snapshot, q]);

  const searching = q.trim().length > 0;
  const fxOnly = useMemo(
    () =>
      filtered.filter(
        (q) => q.currency.kind !== "metal" && q.currency.kind !== "crypto",
      ),
    [filtered],
  );

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

  return (
    <div className="space-y-8">
      {/* Page intro — compact, not competing with market status */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          بازار ارز و طلا
        </h1>
        <p className="text-sm text-muted">
          نرخ‌های بازار آزاد تهران به تومان
        </p>
      </header>

      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}

      {/* Primary signal */}
      <MarketStatus snapshot={snapshot} />

      {/* Featured currencies */}
      <FeaturedGrid quotes={snapshot.quotes} />

      {/* Secondary market blocks — only when not searching */}
      {!searching ? (
        <div className="space-y-8">
          <MetalsSection quotes={snapshot.quotes} />
          <CryptoSection quotes={snapshot.quotes} />
          <Movers quotes={snapshot.quotes} />
        </div>
      ) : null}

      {/* Full list + search */}
      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-base font-medium">
            {searching ? "نتایج جستجو" : "همه ارزها"}
          </h2>
          <span className="text-xs text-subtle">قیمت به تومان</span>
        </div>
        <label className="relative block">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی دلار، طلا، بیت‌کوین..."
            className="ps-10"
            aria-label="جستجوی ارز یا طلا"
          />
        </label>
        {(searching ? filtered : fxOnly).length === 0 ? (
          <EmptySearch query={q} />
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-xl bg-card shadow-card">
            {(searching ? filtered : fxOnly).map((quote) => (
              <CurrencyRow key={quote.code} quote={quote} />
            ))}
          </div>
        )}
      </section>

      <Converter quotes={snapshot.quotes} />
      <SourceBar snapshot={snapshot} />
    </div>
  );
}
