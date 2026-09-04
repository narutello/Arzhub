import type { Currency } from "./currencies";

export type Quote = {
  code: string;
  currency: Currency;
  price: number;
  change: number;
  changePercent: number;
  high: number | null;
  low: number | null;
  updatedAt: string | null;
  direction: "up" | "down" | "flat";
};

export type Snapshot = {
  quotes: Quote[];
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
  marketOpen: boolean;
  note: string | null;
};

export type MarketResult = {
  ok: boolean;
  stale: boolean;
  error: string | null;
  snapshot: Snapshot | null;
};

export type ChartPoint = {
  date: string;
  jalali: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type ChartRange = "1d" | "1w" | "1m" | "3m" | "6m" | "1y";

export type ChartResult = {
  ok: boolean;
  error: string | null;
  code: string;
  range: ChartRange;
  sourceName: string;
  points: ChartPoint[];
};

export const CHART_RANGES: { id: ChartRange; label: string; days: number }[] = [
  { id: "1d", label: "۱ روز", days: 2 },
  { id: "1w", label: "۱ هفته", days: 7 },
  { id: "1m", label: "۱ ماه", days: 30 },
  { id: "3m", label: "۳ ماه", days: 90 },
  { id: "6m", label: "۶ ماه", days: 180 },
  { id: "1y", label: "۱ سال", days: 365 },
];

export const CACHE_KEY = "arzhub-last-snapshot";
