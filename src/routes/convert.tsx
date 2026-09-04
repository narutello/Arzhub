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

export const Route = createFileRoute("/convert")({
  loader: () => getRates(),
  head: () => ({
    meta: [
      { title: "تبدیل ارز | ارزهاب" },
      {
        name: "description",
        content: "تبدیل دلار، یورو، درهم و سایر ارزها به تومان بر اساس نرخ بازار آزاد تهران.",
      },
    ],
  }),
  component: ConvertPage,
});

function ConvertPage() {
  const initial = Route.useLoaderData();
  const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(initial);

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
      <Converter quotes={snapshot.quotes} />
      <SourceBar snapshot={snapshot} />
    </div>
  );
}
