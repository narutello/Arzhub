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
  const isUp = quote.direction === "up";
  const isDown = quote.direction === "down";

  return (
    <span
      className={cn(
        "inline-flex min-w-[4.25rem] items-center justify-center rounded-md px-2 py-0.5 text-[12px] font-semibold tabular-nums tracking-tight",
        isUp && "bg-up/15 text-up",
        isDown && "bg-down/15 text-down",
        !isUp && !isDown && "bg-card-2 text-muted",
      )}
      dir="ltr"
    >
      {formatPercent(quote.changePercent)}
    </span>
  );
}

export function ChangeDetail({ quote }: { quote: Quote }) {
  const tone =
    quote.direction === "up"
      ? "text-up"
      : quote.direction === "down"
        ? "text-down"
        : "text-muted";
  return (
    <span className={cn("inline-flex items-center gap-1.5 tabular-nums text-[13px]", tone)}>
      <span>{formatSigned(quote.change, quote.currency.decimals)}</span>
      <ChangeBadge quote={quote} />
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
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card-2 text-[11px] font-bold tracking-wide text-foreground">
      {code.slice(0, 3)}
    </span>
  );
}
