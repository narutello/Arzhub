import { CloudOff, RefreshCw, SearchX, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingBoard() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="در حال بارگذاری قیمت‌ها">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
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
    <div className="flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-12 text-center shadow-card">
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
    <div className="flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-12 text-center shadow-card">
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
    <div className="flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-12 text-center shadow-card">
      <h2 className="text-base font-medium">فهرست شما خالی است</h2>
      <p className="max-w-sm text-sm text-muted">
        با زدن ستاره کنار هر ارز، آن را به دیدهٔ خود اضافه کنید. این فهرست روی همین دستگاه ذخیره می‌شود.
      </p>
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div className="flex items-center gap-2 rounded-md bg-card-2 px-3 py-2 text-sm text-foreground">
      <WifiOff className="size-4 shrink-0" strokeWidth={1.75} />
      اتصال اینترنت قطع است. آخرین قیمت ذخیره‌شده نمایش داده می‌شود.
    </div>
  );
}

export function StaleBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md bg-card-2 px-3 py-2 text-sm text-muted">
      {message} — آخرین نرخ موفق نمایش داده می‌شود.
    </div>
  );
}
