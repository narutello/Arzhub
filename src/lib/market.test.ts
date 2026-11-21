import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseNum,
  rialToToman,
  directionOf,
  isSameTehranDay,
  newestUpdatedAt,
  marketStatusFromQuotes,
  quotesFromTgju,
  parseHistoryRow,
} from "./market.ts";
import type { Quote } from "./types.ts";
import { CURRENCY_BY_CODE } from "./currencies.ts";

describe("parseNum", () => {
  it("parses plain numbers", () => {
    assert.equal(parseNum(12345), 12345);
    assert.equal(parseNum(0), 0);
    assert.equal(parseNum(-10), -10);
  });

  it("parses numeric strings with commas and noise", () => {
    assert.equal(parseNum("61,500"), 61500);
    assert.equal(parseNum("1,234.56"), 1234.56);
    assert.equal(parseNum("  89000  "), 89000);
    assert.equal(parseNum("price: 45,200 تومان"), 45200);
  });

  it("returns NaN for invalid inputs", () => {
    assert.ok(Number.isNaN(parseNum(null)));
    assert.ok(Number.isNaN(parseNum(undefined)));
    assert.ok(Number.isNaN(parseNum("")));
    assert.ok(Number.isNaN(parseNum("   ")));
    assert.ok(Number.isNaN(parseNum("-")));
    assert.ok(Number.isNaN(parseNum(".")));
    assert.ok(Number.isNaN(parseNum("abc")));
    assert.ok(Number.isNaN(parseNum({})));
    assert.ok(Number.isNaN(parseNum(NaN)));
  });
});

describe("rialToToman", () => {
  it("divides by 10", () => {
    assert.equal(rialToToman(615000), 61500);
    assert.equal(rialToToman(10), 1);
    assert.equal(rialToToman(0), 0);
  });
});

describe("directionOf", () => {
  it("maps change to direction", () => {
    assert.equal(directionOf(100), "up");
    assert.equal(directionOf(-50), "down");
    assert.equal(directionOf(0), "flat");
  });
});

describe("isSameTehranDay / newestUpdatedAt / marketStatusFromQuotes", () => {
  it("newestUpdatedAt picks the latest ISO timestamp", () => {
    const quotes = [
      { updatedAt: "2026-11-20T10:00:00.000Z" },
      { updatedAt: null },
      { updatedAt: "2026-11-21T08:30:00.000Z" },
      { updatedAt: "2026-11-19T23:00:00.000Z" },
    ] as Quote[];
    assert.equal(newestUpdatedAt(quotes), "2026-11-21T08:30:00.000Z");
    assert.equal(newestUpdatedAt([]), null);
  });

  it("isSameTehranDay returns boolean without throwing", () => {
    // We only assert it is a boolean; exact value depends on current Tehran day.
    assert.equal(typeof isSameTehranDay(new Date().toISOString()), "boolean");
    assert.equal(isSameTehranDay(null), false);
    assert.equal(isSameTehranDay("not-a-date"), false);
  });

  it("marketStatusFromQuotes produces a note when market appears closed", () => {
    const oldQuotes = [
      {
        code: "USD",
        currency: CURRENCY_BY_CODE.USD,
        price: 60000,
        priceUsd: null,
        change: 0,
        changePercent: 0,
        high: null,
        low: null,
        updatedAt: "2020-01-01T00:00:00.000Z",
        direction: "flat" as const,
      },
    ];
    const status = marketStatusFromQuotes(oldQuotes);
    assert.equal(status.marketOpen, false);
    assert.ok(status.note && status.note.includes("تعطیل"));
  });
});

describe("quotesFromTgju", () => {
  it("converts a minimal TGJU tick into a Quote with toman prices", () => {
    const current = {
      price_dollar_rl: {
        p: "615000",
        h: "620000",
        l: "610000",
        d: "1000",
        dp: "0.16",
        dt: "",
        ts: "2026-11-21T10:00:00+03:30",
      },
    };
    const quotes = quotesFromTgju(current);
    const usd = quotes.find((q) => q.code === "USD");
    assert.ok(usd);
    assert.equal(usd!.price, 61500); // rial → toman
    assert.equal(usd!.high, 62000);
    assert.equal(usd!.low, 61000);
    assert.equal(usd!.change, 100); // 1000 rial → 100 toman
    assert.equal(usd!.changePercent, 0.16);
    assert.equal(usd!.direction, "up");
  });

  it("uses dt high/low when change is zero", () => {
    const current = {
      price_dollar_rl: {
        p: "600000",
        d: "0",
        dp: "0",
        dt: "high",
        // ts intentionally omitted (optional)
      },
    };
    const quotes = quotesFromTgju(current);
    const usd = quotes.find((q) => q.code === "USD");
    assert.ok(usd);
    assert.equal(usd!.direction, "up");
  });

  it("skips currencies with missing or invalid ticks", () => {
    const quotes = quotesFromTgju({});
    assert.equal(quotes.length, 0);
  });
});

describe("parseHistoryRow", () => {
  it("parses a valid history row into ChartPoint (rial → toman)", () => {
    // TGJU history row shape: [open, low, high, close, ..., gDate, jalali]
    const row = [
      "610000",
      "605000",
      "620000",
      "615000",
      null,
      null,
      "2026/11/20",
      "1404/08/29",
    ];
    const point = parseHistoryRow(row);
    assert.ok(point);
    assert.equal(point!.date, "2026-11-20");
    assert.equal(point!.jalali, "1404/08/29");
    assert.equal(point!.open, 61000);
    assert.equal(point!.low, 60500);
    assert.equal(point!.high, 62000);
    assert.equal(point!.close, 61500);
  });

  it("returns null for malformed rows", () => {
    assert.equal(parseHistoryRow(null), null);
    assert.equal(parseHistoryRow([]), null);
    assert.equal(parseHistoryRow([1, 2, 3]), null);
    assert.equal(
      parseHistoryRow(["a", "b", "c", "d", null, null, "", ""]),
      null,
    );
  });
});
