import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getChart } from "@/lib/market";
import {
  CHART_RANGES,
  type ChartRange,
  type ChartResult,
  type Quote,
} from "@/lib/types";
import { formatChartTick, formatToman, toFaDigits } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function PriceChart({
  quote,
  initial,
  initialRange = "1m",
}: {
  quote: Quote;
  initial?: ChartResult;
  initialRange?: ChartRange;
}) {
  const [range, setRange] = useState<ChartRange>(initialRange);
  const query = useQuery({
    queryKey: ["chart", quote.code, range],
    queryFn: () => getChart({ data: { code: quote.code, range } }),
    initialData: range === initialRange ? initial : undefined,
    staleTime: 10 * 60_000,
  });

  const points = query.data?.points ?? [];
  const stroke = quote.direction === "down" ? "var(--down)" : "var(--up)";

  return (
    <section className="rounded-xl bg-card p-4 shadow-card">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-medium">نمودار قیمت</h2>
        <div className="flex flex-wrap gap-1">
          {CHART_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={cn(
                "h-9 rounded-md px-3 text-xs transition-colors duration-150",
                range === r.id
                  ? "bg-foreground text-background"
                  : "bg-card-2 text-muted hover:text-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {query.isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : !query.data?.ok || points.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          {query.data?.error ?? "نمودار این بازه در دسترس نیست."}
        </p>
      ) : (
        <div dir="ltr" className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="arzFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatChartTick}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                orientation="right"
                tickFormatter={(v: number) =>
                  toFaDigits(Math.round(v).toLocaleString("en-US"))
                }
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={72}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  direction: "rtl",
                  fontFamily: "Vazirmatn, sans-serif",
                }}
                formatter={(value) => [
                  formatToman(Number(value), quote.currency.decimals),
                  "تومان",
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as { jalali?: string } | undefined;
                  return p?.jalali ? toFaDigits(p.jalali) : "";
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={stroke}
                strokeWidth={1.75}
                fill="url(#arzFill)"
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      <p className="mt-3 text-xs text-subtle">
        داده‌های تاریخی از {query.data?.sourceName ?? "TGJU"} — قیمت پایانی روزانه به
        تومان.
      </p>
    </section>
  );
}
