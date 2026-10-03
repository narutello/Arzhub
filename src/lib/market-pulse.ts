import type { Quote } from "./types";

/** Symbols that define the free-market "pulse" (FX + gold/coin). */
export const PULSE_CODES = ["USD", "EUR", "AED", "XAU18", "SEKEE"] as const;

export type PulseLevel = "calm" | "normal" | "turbulent" | "forming";

export type MarketPulse = {
  level: PulseLevel;
  /** Average daily range %, or null when still forming. */
  score: number | null;
  /** How many of the core symbols contributed. */
  sampleSize: number;
  label: string;
  hint: string;
};

/** Intraday range as % of mid price; falls back to |changePercent|. */
function symbolSwingPct(q: Quote): number | null {
  if (
    q.high != null &&
    q.low != null &&
    q.high > 0 &&
    q.low > 0 &&
    q.high >= q.low
  ) {
    const mid = (q.high + q.low) / 2;
    if (mid <= 0) return null;
    return ((q.high - q.low) / mid) * 100;
  }
  if (Number.isFinite(q.changePercent)) {
    return Math.abs(q.changePercent);
  }
  return null;
}

/**
 * Single pulse reading from core free-market quotes.
 * Thresholds are rough for Tehran FX/gold; tune later from real data.
 */
export function computeMarketPulse(
  quotes: Quote[],
  opts?: { marketOpen?: boolean },
): MarketPulse {
  const byCode = new Map(quotes.map((q) => [q.code, q]));
  const swings: number[] = [];

  for (const code of PULSE_CODES) {
    const q = byCode.get(code);
    if (!q) continue;
    const s = symbolSwingPct(q);
    if (s != null && Number.isFinite(s)) swings.push(s);
  }

  const sampleSize = swings.length;

  // Early session or sparse data — don't pretend we know.
  if (sampleSize < 2) {
    return {
      level: "forming",
      score: null,
      sampleSize,
      label: "در حال شکل‌گیری",
      hint: "هنوز دادهٔ کافی از نمادهای اصلی نیست.",
    };
  }

  const score = swings.reduce((a, b) => a + b, 0) / sampleSize;

  // Closed market still shows last-session intensity, but softer copy.
  const closed = opts?.marketOpen === false;

  if (score < 0.55) {
    return {
      level: "calm",
      score,
      sampleSize,
      label: closed ? "آرام (آخرین جلسه)" : "آرام",
      hint: "دامنهٔ حرکت دلار، درهم، طلا و سکه امروز نسبتاً محدود بوده است.",
    };
  }

  if (score < 1.4) {
    return {
      level: "normal",
      score,
      sampleSize,
      label: closed ? "معمولی (آخرین جلسه)" : "معمولی",
      hint: "نوسان نمادهای اصلی در بازهٔ عادی روزهای اخیر است.",
    };
  }

  return {
    level: "turbulent",
    score,
    sampleSize,
    label: closed ? "پرتلاطم (آخرین جلسه)" : "پرتلاطم",
    hint: "دامنهٔ حرکت نمادهای اصلی امروز بالاتر از حالت عادی است.",
  };
}
