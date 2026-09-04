import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONVERTIBLE, type Currency } from "@/lib/currencies";
import { formatNumber, formatToman, toFaDigits } from "@/lib/format";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

function unitPrice(quote: Quote | undefined, currency: Currency): number | null {
  if (currency.code === "IRT") return 1;
  if (!quote) return null;
  return quote.price / currency.quoteUnit;
}

export function Converter({
  quotes,
  defaultFrom = "USD",
  defaultTo = "IRT",
}: {
  quotes: Quote[];
  defaultFrom?: string;
  defaultTo?: string;
}) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [amount, setAmount] = useState("1");
  const byCode = useMemo(
    () => Object.fromEntries(quotes.map((q) => [q.code, q])),
    [quotes],
  );

  const fromCur = CONVERTIBLE.find((c) => c.code === from) ?? CONVERTIBLE[1];
  const toCur = CONVERTIBLE.find((c) => c.code === to) ?? CONVERTIBLE[0];
  const numeric = Number(amount.replace(/,/g, "").replace(/[۰-۹]/g, (d) =>
    String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)),
  ));
  const fromPrice = unitPrice(byCode[fromCur.code], fromCur);
  const toPrice = unitPrice(byCode[toCur.code], toCur);

  let result: number | null = null;
  if (Number.isFinite(numeric) && fromPrice && toPrice) {
    const toman = numeric * fromPrice;
    result = toman / toPrice;
  }

  const fromOptions = CONVERTIBLE.filter(
    (c) => c.code === "IRT" || byCode[c.code],
  );

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="rounded-xl bg-card p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium">تبدیل ارز</h2>
        <p className="text-xs text-muted">مبنای محاسبه: تومان</p>
      </div>
      <div className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs text-muted">مقدار</span>
          <Input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="tabular-nums"
          />
        </label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          <CurrencySelect
            label="از"
            value={from}
            options={fromOptions}
            onChange={setFrom}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="جابه‌جایی"
            onClick={swap}
          >
            <ArrowLeftRight className="size-4" />
          </Button>
          <CurrencySelect
            label="به"
            value={to}
            options={fromOptions}
            onChange={setTo}
          />
        </div>
        <div className="rounded-lg bg-card-2 px-4 py-4">
          {result == null ? (
            <p className="text-sm text-muted">برای این جفت‌ارز نرخی در دسترس نیست.</p>
          ) : (
            <>
              <p className="text-xs text-muted">
                {toFaDigits(amount || "0")} {fromCur.nameFa} برابر است با
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                {toCur.code === "IRT"
                  ? formatToman(result, 0)
                  : formatNumber(result, result >= 100 ? 2 : 4)}{" "}
                <span className="text-base font-medium text-muted">
                  {toCur.nameFa}
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CurrencySelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Currency[];
  onChange: (code: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        {options.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.nameFa}
          </option>
        ))}
      </select>
    </label>
  );
}
