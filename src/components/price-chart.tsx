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
  const isUp = quote.direction !== "down";
  const stroke = isUp ? "var(--up)" : "var(--down)";
  const isLoading = query.isLoading || (query.isFetching && points.length === 0);
  const hasError = !isLoading && (!query.data?.ok || points.length === 0);

  return (
    <section className="rounded-xl bg-card p-4 shadow-card sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-medium">نمودار قیمت</h2>
          <p className="mt-0.5 text-xs text-subtle">
            قیمت فعلی:{" "}
            <span className="font-medium text-foreground tabular-nums">
              {formatToman(quote.price, quote.currency.decimals)}
            </span>{" "}
            تومان
          </p>
        </div>
        <div
          className="flex flex-wrap gap-1"
          role="group"
          aria-label="بازه زمانی نمودار"
        >
          {CHART_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              disabled={query.isFetching && range === r.id}
              className={cn(
                "h-9 min-w-[3.25rem] rounded-md px-2.5 text-xs font-medium transition-colors duration-150",
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

      {isLoading ? (
        <div className="flex h-64 w-full flex-col justify-center gap-3 rounded-lg">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ) : hasError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg bg-card-2/50 px-4 text-center">
          <p className="text-sm text-muted">
            {query.data?.error ?? "نمودار این بازه در دسترس نیست."}
          </p>
          <p className="text-xs text-subtle">
            دادهٔ تاریخی از TGJU برای این بازه موجود نیست یا موقتاً در دسترس نیست.
          </p>
        </div>
      ) : (
        <div dir="ltr" className="h-64 w-full sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 10, right: 4, left: 0, bottom: 4 }}
            >
              <defs>
                <linearGradient id={`arzFill-${quote.code}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={stroke} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border)"
                vertical={false}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatChartTick}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
                dy={6}
              />
              <YAxis
                orientation="right"
                tickFormatter={(v: number) =>
                  toFaDigits(Math.round(v).toLocaleString("en-US"))
                }
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
                domain={["auto", "auto"]}
                dx={4}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  direction: "rtl",
                  fontFamily: "Vazirmatn, sans-serif",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  padding: "8px 12px",
                }}
                itemStyle={{ color: "var(--foreground)" }}
                labelStyle={{ color: "var(--muted)", marginBottom: 4 }}
                formatter={(value) => [
                  formatToman(Number(value), quote.currency.decimals),
                  "قیمت پایانی",
                ]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as
                    | { jalali?: string; date?: string }
                    | undefined;
                  if (p?.jalali) return toFaDigits(p.jalali);
                  if (p?.date) return formatChartTick(p.date);
                  return "";
                }}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={stroke}
                strokeWidth={2}
                fill={`url(#arzFill-${quote.code})`}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: "var(--card)",
                  stroke,
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-3 text-xs text-subtle">
        داده‌های تاریخی از{" "}
        <span className="text-muted">
          {query.data?.sourceName ?? "شبکه اطلاع‌رسانی طلا و ارز (TGJU)"}
        </span>
        {" "}— قیمت پایانی روزانه به تومان.
      </p>
    </section>
  );
}
