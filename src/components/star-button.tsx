import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatchlist } from "@/lib/watchlist";
import { cn } from "@/lib/utils";

export function StarButton({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const has = useWatchlist((s) => s.codes.includes(code));
  const toggle = useWatchlist((s) => s.toggle);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const filled = ready && has;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("shrink-0", className)}
      aria-pressed={filled}
      aria-label={filled ? "حذف از نشان‌شده" : "افزودن به نشان‌شده"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(code);
      }}
    >
      <Star
        className={cn("size-4", filled && "fill-foreground")}
        strokeWidth={1.75}
      />
    </Button>
  );
}
