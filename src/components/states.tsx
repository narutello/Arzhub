import { CloudOff, RefreshCw, SearchX, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingBoard() {
  return (
    <div
      className="space-y-8"
      aria-busy="true"
      aria-label="در حال بارگذاری قیمت‌ها"
    >
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-40 rounded-md" />
        <Skeleton className="h-4 w-56 rounded-md" />
      </div>

      {/* Market status */}
      <Skeleton className="h-28 rounded-xl" />

      {/* Featured cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>

      {/* Section block */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-40 rounded-xl" />
      </div>

      {/* List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg" />
        <div className="overflow-hidden rounded-xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-none border-b border-border/40 last:border-0" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-14 text-center shadow-card">
      <CloudOff className="size-8 text-down" strokeWidth={1.5} />
      <h2 className="text-base font-medium">قیمت‌ها به‌روزرسانی نشد</h2>
      <p className="max-w-sm text-sm text-muted">{message}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry} className="mt-2">
          <RefreshCw className="size-4" />
          تلاش دوباره
        </Button>
      ) : null}
    </div>
  );
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-14 text-center shadow-card">
      <SearchX className="size-8 text-subtle" strokeWidth={1.5} />
      <h2 className="text-base font-medium">ارزی پیدا نشد</h2>
      <p className="text-sm text-muted">
        نتیجه‌ای برای «{query}» در فهرست ارزهاب نیست.
      </p>
    </div>
  );
}

export function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-14 text-center shadow-card">
      <h2 className="text-base font-medium">فهرست شما خالی است</h2>
      <p className="max-w-sm text-sm text-muted">
        با زدن ستاره کنار هر ارز، آن را به دیدهٔ خود اضافه کنید. این فهرست روی
        همین دستگاه ذخیره می‌شود.
      </p>
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground">
      <WifiOff className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
      اتصال اینترنت قطع است. آخرین قیمت ذخیره‌شده نمایش داده می‌شود.
    </div>
  );
}

export function StaleBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted">
      {message} — آخرین نرخ موفق نمایش داده می‌شود.
    </div>
  );
}
