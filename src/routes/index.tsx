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
  Movers,
  SourceBar,
} from "@/components/market-overview";
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
      { title: "ارزهاب | قیمت لحظه‌ای ارز به تومان" },
      {
        name: "description",
        content:
          "نمای کلی بازار آزاد تهران: دلار، یورو، درهم و سایر ارزها به تومان، همراه با بیشترین افزایش و کاهش.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(initial);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!snapshot) return [];
    const wanted = new Set(searchCurrencies(q).map((c) => c.code));
    return snapshot.quotes.filter((quote) => wanted.has(quote.code));
  }, [snapshot, q]);

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
    <div className="space-y-5">
      <header className="px-1 pt-1">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">بازار</h1>
        <p className="mt-0.5 text-[13px] text-muted">قیمت آزاد · به تومان</p>
      </header>

      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}

      <MarketStatus snapshot={snapshot} />
      <FeaturedGrid quotes={snapshot.quotes} />
      <Movers quotes={snapshot.quotes} />

      <section className="space-y-2">
        <div className="flex items-end justify-between gap-3 px-1">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
            همه ارزها
          </h2>
          <span className="text-[11px] text-subtle">تومان</span>
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجو"
            className="h-10 rounded-xl border-0 bg-card-2/80 ps-10 text-[15px] shadow-none focus-visible:ring-1"
            aria-label="جستجوی ارز"
          />
        </label>

        {filtered.length === 0 ? (
          <EmptySearch query={q} />
        ) : (
          <div className="ios-group divide-y divide-[var(--separator)]">
            {filtered.map((quote) => (
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
