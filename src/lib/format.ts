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

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const decimals = abs >= 10 ? 1 : 2;
  const body = formatNumber(abs, decimals);
  if (value > 0) return `٪${body}+`;
  if (value < 0) return `٪${body}−`;
  return `٪${body}`;
}

const tehranDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  weekday: "long",
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

export function formatTehranDate(iso: string | number | Date): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return tehranDate.format(d);
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
