import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { ArrowLeftRight, Check, Link2 } from "lucide-react";
import { numberToWords } from "@persian-tools/persian-tools";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONVERTIBLE, type Currency } from "@/lib/currencies";
import { formatNumber, formatToman, toFaDigits } from "@/lib/format";
import type { Quote } from "@/lib/types";
import { cn } from "@/lib/utils";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const MAX_DIGITS = 12;

function sanitizeRaw(value: string): string {
  let hasDecimal = false;
  let result = "";
  for (const ch of value) {
    if (ch >= "0" && ch <= "9") {
      result += ch;
    } else if (FA_DIGITS.includes(ch)) {
      result += String(FA_DIGITS.indexOf(ch));
    } else if ((ch === "." || ch === "٫") && !hasDecimal) {
      hasDecimal = true;
      result += ".";
    }
  }
  const [intPart = "", decPart = ""] = result.split(".");
  const limitedInt = intPart.slice(0, MAX_DIGITS);
  const limitedDec = decPart.slice(0, 4);
  return limitedDec.length > 0 ? `${limitedInt}.${limitedDec}` : limitedInt;
}

function formatWithSeparators(raw: string): string {
  if (!raw) return "";
  const [intPart = "", decPart] = raw.split(".");
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "٬");
  const faInt = toFaDigits(withSep);
  if (decPart !== undefined && decPart.length > 0) {
    return `${faInt}٫${toFaDigits(decPart)}`;
  }
  return faInt;
}

function unitPrice(quote: Quote | undefined, currency: Currency): number | null {
  if (currency.code === "IRT") return 1;
  if (!quote) return null;
  return quote.price / currency.quoteUnit;
}

function toPersianWords(value: number): string | null {
  if (!Number.isFinite(value)) return null;
  try {
    const intValue = Math.round(value);
    if (!Number.isSafeInteger(intValue)) return null;
    const words = numberToWords(intValue);
    return typeof words === "string" ? words : null;
  } catch {
    return null;
  }
}

function resolveCode(code: string | undefined, fallback: string): string {
  if (!code) return fallback;
  const upper = code.toUpperCase();
  return CONVERTIBLE.some((c) => c.code === upper) ? upper : fallback;
}

function amountFromParam(raw: string | undefined | null): string {
  if (raw == null || raw === "") return "۱";
  const cleaned = sanitizeRaw(String(raw));
  return cleaned ? formatWithSeparators(cleaned) : "۱";
}

function buildSharePath(from: string, to: string, amount: string): string {
  const rawAmount = amount
    .replace(/٬/g, "")
    .replace(/٫/g, ".")
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  if (rawAmount) params.set("amount", rawAmount);
  return `/convert?${params.toString()}`;
}

function readUrlDefaults(): {
  from?: string;
  to?: string;
  amount?: string;
} {
  if (typeof window === "undefined") return {};
  if (window.location.pathname !== "/convert") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    from: p.get("from") ?? undefined,
    to: p.get("to") ?? undefined,
    amount: p.get("amount") ?? undefined,
  };
}

export function Converter({
  quotes,
  defaultFrom = "USD",
  defaultTo = "IRT",
  defaultAmount,
  syncUrl = false,
}: {
  quotes: Quote[];
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: string;
  syncUrl?: boolean;
}) {
  const urlDefaults = syncUrl ? readUrlDefaults() : {};
  const initialFrom = resolveCode(defaultFrom ?? urlDefaults.from, "USD");
  const initialTo = resolveCode(defaultTo ?? urlDefaults.to, "IRT");
  const initialAmount = amountFromParam(
    defaultAmount ?? urlDefaults.amount ?? undefined,
  );

  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [amount, setAmount] = useState(initialAmount);
  const [copied, setCopied] = useState(false);
  const readyToSync = useRef(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // next tick — avoid racing first paint / shared-link seed
    const t = window.setTimeout(() => {
      readyToSync.current = true;
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const byCode = useMemo(
    () => Object.fromEntries(quotes.map((q) => [q.code, q])),
    [quotes],
  );

  const fromCur = CONVERTIBLE.find((c) => c.code === from) ?? CONVERTIBLE[1];
  const toCur = CONVERTIBLE.find((c) => c.code === to) ?? CONVERTIBLE[0];

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

  const persianWords = result != null ? toPersianWords(result) : null;

  const fromOptions = CONVERTIBLE.filter(
    (c) => c.code === "IRT" || byCode[c.code],
  );

  // Debounced URL sync — never remount; just update the address bar quietly
  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;
    if (window.location.pathname !== "/convert") return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      if (!readyToSync.current) return;
      const next = buildSharePath(from, to, amount);
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) {
        window.history.replaceState(null, "", next);
      }
    }, 300);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [syncUrl, from, to, amount]);

  function handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    const cleaned = sanitizeRaw(e.target.value);
    setAmount(formatWithSeparators(cleaned));
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  async function shareLink() {
    const path = buildSharePath(from, to, amount);
    const url = `${window.location.origin}${path}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "تبدیل ارز | ارزهاب",
          text: `${amount || "۰"} ${fromCur.nameFa} → ${toCur.nameFa}`,
          url,
        });
        return;
      }
    } catch {
      // cancelled
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-xl bg-card p-4 shadow-card min-w-0 overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-medium shrink-0">تبدیل ارز</h2>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted hidden sm:inline shrink-0">
            مبنای محاسبه: تومان
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void shareLink()}
            className="h-8 gap-1.5 px-2.5 text-xs"
            aria-label="اشتراک لینک تبدیل"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                کپی شد
              </>
            ) : (
              <>
                <Link2 className="size-3.5" />
                اشتراک
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="grid gap-3 min-w-0">
        <label className="grid gap-1.5 min-w-0">
          <span className="text-xs text-muted">مقدار</span>
          <Input
            inputMode="decimal"
            value={amount}
            onChange={handleAmountChange}
            className="tabular-nums min-w-0 w-full overflow-hidden text-ellipsis"
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
            className="shrink-0"
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
            <p className="text-sm text-muted">
              برای این جفت‌ارز نرخی در دسترس نیست.
            </p>
          ) : (
            <>
              <p className="text-xs text-muted break-words">
                {amount || "۰"} {fromCur.flag} {fromCur.nameFa} برابر است با
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight break-all leading-snug">
                {toCur.code === "IRT"
                  ? formatToman(result, 0)
                  : formatNumber(result, result >= 100 ? 2 : 4)}{" "}
                <span className="text-base font-medium text-muted">
                  {toCur.flag} {toCur.nameFa}
                </span>
              </p>
              {persianWords && (
                <p className="mt-2 text-sm text-muted leading-relaxed">
                  {persianWords} {toCur.nameFa}
                </p>
              )}
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
            {c.flag} {c.code} — {c.nameFa}
          </option>
        ))}
      </select>
    </label>
  );
}
