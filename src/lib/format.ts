const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toFaDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);
}

export function formatNumber(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "—";
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return toFaDigits(formatted).replace(/,/g, "٬").replace(/\./g, "٫");
}

export function formatToman(value: number, decimals = 0): string {
  return formatNumber(value, decimals);
}

export function formatSigned(value: number, decimals = 0): string {
  if (!Number.isFinite(value) || value === 0) return formatNumber(0, decimals);
  const sign = value > 0 ? "+" : "−";
  return sign + formatNumber(Math.abs(value), decimals);
}

/** e.g. +۰٫۲۶٪  /  −۱٫۵۰٪  /  ۰٪ */
export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const decimals = abs >= 10 ? 1 : 2;
  const body = formatNumber(abs, decimals);
  if (value > 0) return `+${body}٪`;
  if (value < 0) return `−${body}٪`;
  return `${body}٪`;
}

const tehranParts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const tehranTime = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  hour: "2-digit",
  minute: "2-digit",
});

const tehranShort = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  day: "numeric",
  month: "short",
});

function part(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((p) => p.type === type)?.value ?? "";
}

/** Force day–month–year order: «۹ مهر ۱۴۰۵» */
function formatDayMonthYear(d: Date): string {
  const parts = tehranParts.formatToParts(d);
  const day = part(parts, "day");
  const month = part(parts, "month");
  const year = part(parts, "year");
  return [day, month, year].filter(Boolean).join(" ");
}

export function formatTehranDate(iso: string | number | Date): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return formatDayMonthYear(d);
}

export function formatTehranTime(iso: string | number | Date): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return tehranTime.format(d);
}

export function formatTehranShort(iso: string | number | Date): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return tehranShort.format(d);
}

export function formatChartTick(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return tehranShort.format(d);
}

/**
 * Relative age in Persian, Tehran wall-clock context.
 * e.g. «همین الان» · «۳ دقیقه پیش» · «۲ ساعت پیش»
 */
export function formatRelativeFa(iso: string | number | Date): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const sec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (sec < 45) return "همین الان";
  if (sec < 3600) {
    const m = Math.floor(sec / 60);
    return `${toFaDigits(m)} دقیقه پیش`;
  }
  if (sec < 86400) {
    const h = Math.floor(sec / 3600);
    return `${toFaDigits(h)} ساعت پیش`;
  }
  const days = Math.floor(sec / 86400);
  if (days === 1) return "دیروز";
  return `${toFaDigits(days)} روز پیش`;
}

/**
 * Shareable price text (format 4):
 * دلار آمریکا: ۱۱۵٬۴۲۰ تومان
 * ۹ مهر ۱۴۰۵ — ۱۴:۳۰
 */
export function formatPriceShare({
  nameFa,
  price,
  decimals = 0,
  updatedAt,
  unitLabel = "تومان",
}: {
  nameFa: string;
  price: number;
  decimals?: number;
  updatedAt?: string | number | Date | null;
  unitLabel?: string;
}): string {
  const priceLine = `${nameFa}: ${formatToman(price, decimals)} ${unitLabel}`;
  const when = updatedAt != null ? new Date(updatedAt) : new Date();
  if (Number.isNaN(when.getTime())) return priceLine;
  const date = formatDayMonthYear(when);
  const time = tehranTime.format(when);
  return `${priceLine}\n${date} — ${time}`;
}
