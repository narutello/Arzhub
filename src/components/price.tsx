import { cn } from "@/lib/utils";
import { formatPercent, formatSigned, formatToman } from "@/lib/format";
import type { Quote } from "@/lib/types";

export function PriceValue({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  return (
    <span className={cn("tabular-nums tracking-tight", className)}>
      {formatToman(value, decimals)}
    </span>
  );
}

export function ChangeBadge({ quote }: { quote: Quote }) {
  const tone =
    quote.direction === "up"
      ? "text-up"
      : quote.direction === "down"
        ? "text-down"
        : "text-muted";
  return (
    <span className={cn("inline-flex items-center gap-1 tabular-nums text-sm", tone)}>
      <span>{formatSigned(quote.change, quote.currency.decimals)}</span>
      <span dir="ltr">{formatPercent(quote.changePercent)}</span>
    </span>
  );
}

export function RangeBar({ quote }: { quote: Quote }) {
  if (quote.high == null || quote.low == null || quote.high <= quote.low) {
    return null;
  }
  const span = quote.high - quote.low;
  const pos = Math.min(100, Math.max(0, ((quote.price - quote.low) / span) * 100));
  return (
    <div
      className="relative h-1 w-16 overflow-hidden rounded-full bg-card-2"
      title="نوسان روزانه"
    >
      <div className="absolute inset-y-0 start-0 bg-border-strong" style={{ width: "100%" }} />
      <div
        className="absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-foreground"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}

export function CodeMark({ code }: { code: string }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-card-2 text-[0.6875rem] font-semibold tracking-wide text-foreground">
      {code}
    </span>
  );
}
