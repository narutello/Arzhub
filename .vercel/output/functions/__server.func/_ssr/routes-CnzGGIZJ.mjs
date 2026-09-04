import { i as __toESM } from "../_runtime.mjs";
import { o as searchCurrencies } from "./types-CWELa7eF.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as Search } from "../_libs/lucide-react.mjs";
import { o as Route$4 } from "./router-CSzsPqoA.mjs";
import { T as useMarket, c as LoadingBoard, d as OfflineBanner, h as StaleBanner, i as EmptySearch, l as MarketStatus, m as SourceBar, o as ErrorState, r as CurrencyRow, s as FeaturedGrid, u as Movers } from "./states-CN6enomQ.mjs";
import { t as Input } from "./input-DlntZo-x.mjs";
import { t as Converter } from "./converter-4K1DR4Mp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CnzGGIZJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const initial = Route$4.useLoaderData();
	const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(initial);
	const [q, setQ] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		if (!snapshot) return [];
		const wanted = new Set(searchCurrencies(q).map((c) => c.code));
		return snapshot.quotes.filter((quote) => wanted.has(quote.code));
	}, [snapshot, q]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingBoard, {});
	if (!snapshot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error ?? "اتصال به منبع قیمت برقرار نشد.",
		onRetry: () => {
			refetch();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "بازار ارز"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "قیمت‌های بازار آزاد تهران، به تومان. بدون نرخ رسمی یا تصادفی."
				})]
			}),
			offline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {}) : null,
			stale && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaleBanner, { message: error }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketStatus, { snapshot }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturedGrid, { quotes: snapshot.quotes }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Movers, { quotes: snapshot.quotes }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-medium",
							children: "همه ارزها"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: "قیمت به تومان"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "جستجوی دلار، یورو، درهم...",
							className: "ps-10",
							"aria-label": "جستجوی ارز"
						})]
					}),
					filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptySearch, { query: q }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card",
						children: filtered.map((quote) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyRow, { quote }, quote.code))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Converter, { quotes: snapshot.quotes }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBar, { snapshot })
		]
	});
}
//#endregion
export { Home as component };
