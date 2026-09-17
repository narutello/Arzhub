import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPriceShare } from "@/lib/format";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CopyPriceButton({
  quote,
  className,
  size = "sm",
}: {
  quote: Quote;
  className?: string;
  size?: "sm" | "md";
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const text = formatPriceShare({
      nameFa: quote.currency.nameFa,
      price: quote.price,
      decimals: quote.currency.decimals,
      updatedAt: quote.updatedAt,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "icon"}
      className={cn("shrink-0", className)}
      aria-label={copied ? "کپی شد" : "کپی قیمت"}
      title={copied ? "کپی شد" : "کپی قیمت"}
      onClick={(e) => void handleCopy(e)}
    >
      {copied ? (
        <Check className="size-4 text-up" strokeWidth={2} />
      ) : (
        <Copy className="size-4" strokeWidth={1.75} />
      )}
    </Button>
  );
}
