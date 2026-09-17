import { createFileRoute } from "@tanstack/react-router";
import { getRates } from "@/lib/market";
import { useMarket } from "@/lib/use-market";
import { Converter } from "@/components/converter";
import { SourceBar } from "@/components/market-overview";
import {
  ErrorState,
  LoadingBoard,
  OfflineBanner,
  StaleBanner,
} from "@/components/states";

type ConvertSearch = {
  from?: string;
  to?: string;
  amount?: string;
};

function asParam(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

export const Route = createFileRoute("/convert")({
  validateSearch: (search: Record<string, unknown>): ConvertSearch => ({
    from: asParam(search.from),
    to: asParam(search.to),
    amount: asParam(search.amount),
  }),
  loader: () => getRates(),
  head: () => ({
    meta: [
      { title: "تبدیل ارز | ارزهاب" },
      {
        name: "description",
        content:
          "تبدیل دلار، یورو، درهم و سایر ارزها به تومان بر اساس نرخ بازار آزاد تهران.",
      },
    ],
  }),
  component: ConvertPage,
});

function ConvertPage() {
  const initial = Route.useLoaderData();
  const search = Route.useSearch();
  const { snapshot, error, stale, offline, isLoading, refetch } =
    useMarket(initial);

  if (isLoading) return <LoadingBoard />;
  if (!snapshot) {
    return (
      <ErrorState
        message={error ?? "برای تبدیل ارز به نرخ به‌روز نیاز است."}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const from = search.from?.toUpperCase();
  const to = search.to?.toUpperCase();
  const amount = search.amount;

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">تبدیل ارز</h1>
        <p className="text-sm text-muted">
          محاسبه بر اساس آخرین نرخ بازار آزاد. همه مقادیر به تومان قابل تبدیل‌اند.
        </p>
      </header>
      {offline ? <OfflineBanner /> : null}
      {stale && error ? <StaleBanner message={error} /> : null}
      <Converter
        key={`${from ?? ""}-${to ?? ""}-${amount ?? ""}`}
        quotes={snapshot.quotes}
        defaultFrom={from}
        defaultTo={to}
        defaultAmount={amount}
        syncUrl
      />
      <SourceBar snapshot={snapshot} />
    </div>
  );
}
