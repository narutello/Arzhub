import { useEffect } from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import {
  isChunkLoadError,
  reloadForNewDeploy,
} from "@/lib/chunk-load-recovery";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (chunkError) reloadForNewDeploy();
  }, [chunkError]);

  if (chunkError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
        <h1 className="text-lg font-semibold">نسخهٔ جدید آماده است</h1>
        <p className="max-w-md text-sm text-muted">
          صفحه را یک‌بار تازه کنید تا آخرین نسخه بارگذاری شود.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          بارگذاری مجدد
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      <span className="text-down" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={1.75} />
      </span>
      <h1 className="text-lg font-semibold">خطایی رخ داد</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message ||
          "یک خطای پیش‌بینی‌نشده رخ داد. صفحه را دوباره بارگذاری کنید."}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        بارگذاری مجدد
      </button>
    </main>
  );
}
