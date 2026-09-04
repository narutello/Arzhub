import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      <span className="text-down" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={1.75} />
      </span>
      <h1 className="text-lg font-semibold">خطایی رخ داد</h1>
      <p className="max-w-md text-sm break-words text-muted">
        {error.message || "یک خطای پیش‌بینی‌نشده رخ داد. صفحه را دوباره بارگذاری کنید."}
      </p>
    </main>
  );
}
