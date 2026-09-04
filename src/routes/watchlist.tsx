import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getRates } from "@/lib/market";
import { useMarket } from "@/lib/use-market";
import { useWatchlist } from "@/lib/watchlist";
import { CurrencyRow } from "@/components/currency-row";
import { SourceBar } from "@/components/market-overview";
import {
  EmptyWatchlist,
  ErrorState,
  LoadingBoard,
  OfflineBanner,
  StaleBanner,
} from "@/components/states";

export const Route = createFileRoute("/watchlist")({
  loader: () => getRates(),
  head: () => ({
    meta: [
      { title: "نشان‌شده‌ها | ارزهاب" },
      {
        name: "description",
        content: "فهرست ارزهای منتخب شما برای پیگیری قیمت در بازار آزاد تهران.",
      },
    ],
  }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const initial = Route.useLoaderData();
  const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(initial);
  const codes = useWatchlist((s) => s.codes);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

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

  const quotes = ready ? snapshot.quotes.filter((q) => codes.includes(q.code)) : [];

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">نشان‌شده‌ها</h1>
        <p className="text-sm text-muted">
          این فهرست روی همین دستگاه ذخیره می‌شود و بین دستگاه‌ها همگام نیست.
        </p>
      </header>
      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}
      {!ready ? (
        <LoadingBoard />
      ) : quotes.length === 0 ? (
        <EmptyWatchlist />
      ) : (
        <div className="divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card">
          {quotes.map((quote) => (
            <CurrencyRow key={quote.code} quote={quote} />
          ))}
        </div>
      )}
      <SourceBar snapshot={snapshot} />
    </div>
  );
}
