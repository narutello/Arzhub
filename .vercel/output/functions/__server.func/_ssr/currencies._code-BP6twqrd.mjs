import { i as __toESM } from "../_runtime.mjs";
import { a as CURRENCY_BY_CODE, n as CHART_RANGES } from "./types-CWELa7eF.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { c as cn, l as getChart, n as Route } from "./router-CSzsPqoA.mjs";
import { C as formatToman, S as formatTehranTime, T as useMarket, _ as formatChartTick, b as formatSigned, c as LoadingBoard, d as OfflineBanner, f as PriceValue, g as StarButton, h as StaleBanner, m as SourceBar, n as CodeMark, o as ErrorState, p as Skeleton, t as ChangeBadge, w as toFaDigits, x as formatTehranDate, y as formatPercent } from "./states-CN6enomQ.mjs";
import { t as Converter } from "./converter-4K1DR4Mp.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/currencies._code-BP6twqrd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PriceChart({ quote, initial, initialRange = "1m" }) {
	const [range, setRange] = (0, import_react.useState)(initialRange);
	const query = useQuery({
		queryKey: [
			"chart",
			quote.code,
			range
		],
		queryFn: () => getChart({ data: {
			code: quote.code,
			range
		} }),
		initialData: range === initialRange ? initial : void 0,
		staleTime: 6e5
	});
	const points = query.data?.points ?? [];
	const stroke = quote.direction === "down" ? "var(--down)" : "var(--up)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-medium",
					children: "نمودار قیمت"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1",
					children: CHART_RANGES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRange(r.id),
						className: cn("h-9 rounded-md px-3 text-xs transition-colors duration-150", range === r.id ? "bg-foreground text-background" : "bg-card-2 text-muted hover:text-foreground"),
						children: r.label
					}, r.id))
				})]
			}),
			query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full rounded-lg" }) : !query.data?.ok || points.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-center text-sm text-muted",
				children: query.data?.error ?? "نمودار این بازه در دسترس نیست."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				dir: "ltr",
				className: "h-64 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: points,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "arzFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: stroke,
									stopOpacity: .28
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: stroke,
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "date",
								tickFormatter: formatChartTick,
								tick: {
									fill: "var(--muted)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								orientation: "right",
								tickFormatter: (v) => toFaDigits(Math.round(v).toLocaleString("en-US")),
								tick: {
									fill: "var(--muted)",
									fontSize: 11
								},
								axisLine: false,
								tickLine: false,
								width: 72,
								domain: ["auto", "auto"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8,
									direction: "rtl",
									fontFamily: "Vazirmatn, sans-serif"
								},
								formatter: (value) => [formatToman(Number(value), quote.currency.decimals), "تومان"],
								labelFormatter: (_, payload) => {
									const p = payload?.[0]?.payload;
									return p?.jalali ? toFaDigits(p.jalali) : "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "close",
								stroke,
								strokeWidth: 1.75,
								fill: "url(#arzFill)",
								dot: false,
								isAnimationActive: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-subtle",
				children: [
					"داده‌های تاریخی از ",
					query.data?.sourceName ?? "TGJU",
					" — قیمت پایانی روزانه به تومان."
				]
			})
		]
	});
}
function CurrencyDetail() {
	const { rates, chart, code } = Route.useLoaderData();
	const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(rates);
	const currency = CURRENCY_BY_CODE[code];
	const quote = snapshot?.quotes.find((q) => q.code === code);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingBoard, {});
	if (!snapshot || !quote || !currency) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error ?? "نرخ این ارز در دسترس نیست.",
		onRetry: () => {
			refetch();
		}
	});
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "ExchangeRateSpecification",
		name: `قیمت ${currency.nameFa}`,
		currency: currency.code,
		currentExchangeRate: {
			"@type": "UnitPriceSpecification",
			price: Math.round(quote.price * 10),
			priceCurrency: "IRR",
			description: "نرخ بازار آزاد به ریال (نمایش سایت به تومان است)"
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
				type: "application/ld+json",
				dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) }
			}),
			offline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {}) : null,
			stale && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaleBanner, { message: error }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeMark, { code: quote.code }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: currency.nameEn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-semibold tracking-tight",
							children: currency.nameFa
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [currency.countryFa, currency.quoteUnitLabel ? ` · ${currency.quoteUnitLabel}` : null]
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarButton, { code: quote.code })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-card p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "قیمت فعلی (تومان)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-4xl font-semibold tracking-tight",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceValue, {
							value: quote.price,
							decimals: currency.decimals
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { quote })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "تغییر",
								value: formatSigned(quote.change, currency.decimals),
								tone: quote.direction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "درصد",
								value: formatPercent(quote.changePercent),
								tone: quote.direction
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "بالای روز",
								value: quote.high != null ? formatToman(quote.high, currency.decimals) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "پایین روز",
								value: quote.low != null ? formatToman(quote.low, currency.decimals) : "—"
							})
						]
					}),
					quote.updatedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs text-subtle",
						children: [
							"زمان نرخ منبع: ",
							formatTehranDate(quote.updatedAt),
							"،",
							" ",
							formatTehranTime(quote.updatedAt)
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceChart, {
				quote,
				initial: chart
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Converter, {
				quotes: snapshot.quotes,
				defaultFrom: quote.code,
				defaultTo: "IRT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBar, { snapshot })
		]
	});
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-card-2 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `mt-1 font-medium tabular-nums ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-foreground"}`,
			children: value
		})]
	});
}
//#endregion
export { CurrencyDetail as component };
