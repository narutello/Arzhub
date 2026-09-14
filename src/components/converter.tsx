import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONVERTIBLE, type Currency } from "@/lib/currencies";
import { formatNumber, formatToman, toFaDigits } from "@/lib/format";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const MAX_DIGITS = 15;

/** Convert Persian digits to English and strip everything except digits and one decimal point */
function sanitizeRaw(value: string): string {
  let hasDecimal = false;
  let result = "";
  for (const ch of value) {
    if (ch >= "0" && ch <= "9") {
      result += ch;
    } else if (FA_DIGITS.includes(ch)) {
      result += String(FA_DIGITS.indexOf(ch));
    } else if ((ch === "." || ch === "٫" || ch === ",") && !hasDecimal) {
      // allow only one decimal separator (٫ or .)
      if (ch === "." || ch === "٫") {
        hasDecimal = true;
        result += ".";
      }
      // ignore thousand separators while typing
    }
  }
  // limit total digits (before + after decimal)
  const [intPart = "", decPart = ""] = result.split(".");
  const limitedInt = intPart.slice(0, MAX_DIGITS);
  const limitedDec = decPart.slice(0, 6);
  return limitedDec.length > 0 ? `${limitedInt}.${limitedDec}` : limitedInt;
}

/** Format a clean numeric string with Persian thousand separators (٬) */
function formatWithSeparators(raw: string): string {
  if (!raw) return "";
  const [intPart = "", decPart] = raw.split(".");
  // add thousand separators from the right
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  const faInt = toFaDigits(withSep);
  if (decPart !== undefined) {
    return `${faInt}٫${toFaDigits(decPart)}`;
  }
  return faInt;
}

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
  // store the *display* value (with separators + FA digits)
  const [amount, setAmount] = useState("۱");

  const byCode = useMemo(
    () => Object.fromEntries(quotes.map((q) => [q.code, q])),
    [quotes],
  );

  const fromCur = CONVERTIBLE.find((c) => c.code === from) ?? CONVERTIBLE[1];
  const toCur = CONVERTIBLE.find((c) => c.code === to) ?? CONVERTIBLE[0];

  // parse display value back to a real number
  const numeric = Number(
    amount
      .replace(/٬/g, "")
      .replace(/٫/g, ".")
      .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d))),
  );

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

  function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleaned = sanitizeRaw(e.target.value);
    setAmount(formatWithSeparators(cleaned));
  }

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
        <label className="grid gap-1.5 min-w-0">
          <span className="text-xs text-muted">مقدار</span>
          <Input
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            className="tabular-nums min-w-0 overflow-hidden text-ellipsis"
          />
        </label>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 min-w-0">
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
        <div className="rounded-lg bg-card-2 px-4 py-4 min-w-0 overflow-hidden">
          {result == null ? (
            <p className="text-sm text-muted">برای این جفت‌ارز نرخی در دسترس نیست.</p>
          ) : (
            <>
              <p className="text-xs text-muted break-words">
                {amount || "۰"} {fromCur.nameFa} برابر است با
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight break-all">
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
    <label className="grid gap-1.5 min-w-0">
      <span className="text-xs text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-11 w-full min-w-0 rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
