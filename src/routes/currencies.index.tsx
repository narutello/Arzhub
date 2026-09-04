import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getRates } from "@/lib/market";
import { useMarket } from "@/lib/use-market";
import { searchCurrencies } from "@/lib/currencies";
import { CurrencyRow } from "@/components/currency-row";
import { SourceBar } from "@/components/market-overview";
import { Input } from "@/components/ui/input";
import {
  EmptySearch,
  ErrorState,
  LoadingBoard,
  OfflineBanner,
  StaleBanner,
} from "@/components/states";

export const Route = createFileRoute("/currencies/")({
  loader: () => getRates(),
  head: () => ({
    meta: [
      { title: "فهرست ارزها | ارزهاب" },
      {
        name: "description",
        content:
          "فهرست کامل قیمت دلار، یورو، پوند، درهم، لیر، یوان و سایر ارزها در بازار آزاد به تومان.",
      },
    ],
  }),
  component: CurrenciesPage,
});

function CurrenciesPage() {
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
        message={error ?? "قیمت‌ها در دسترس نیست."}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">همه ارزها</h1>
        <label className="relative block">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی ارز، کشور یا کد..."
            className="ps-10"
            aria-label="جستجوی ارز"
          />
        </label>
      </header>
      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}
      {filtered.length === 0 ? (
        <EmptySearch query={q} />
      ) : (
        <div className="divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card">
          {filtered.map((quote) => (
            <CurrencyRow key={quote.code} quote={quote} />
          ))}
        </div>
      )}
      <SourceBar snapshot={snapshot} />
    </div>
  );
}
