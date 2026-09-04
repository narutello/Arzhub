import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as Route$1 } from "./router-CSzsPqoA.mjs";
import { E as useWatchlist, T as useMarket, a as EmptyWatchlist, c as LoadingBoard, d as OfflineBanner, h as StaleBanner, m as SourceBar, o as ErrorState, r as CurrencyRow } from "./states-CN6enomQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watchlist-Bw-StLDd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WatchlistPage() {
	const initial = Route$1.useLoaderData();
	const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(initial);
	const codes = useWatchlist((s) => s.codes);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingBoard, {});
	if (!snapshot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error ?? "قیمت‌ها در دسترس نیست.",
		onRetry: () => {
			refetch();
		}
	});
	const quotes = ready ? snapshot.quotes.filter((q) => codes.includes(q.code)) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "نشان‌شده‌ها"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "این فهرست روی همین دستگاه ذخیره می‌شود و بین دستگاه‌ها همگام نیست."
				})]
			}),
			offline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {}) : null,
			stale && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaleBanner, { message: error }) : null,
			!ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingBoard, {}) : quotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyWatchlist, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border rounded-xl bg-card px-1 py-1 shadow-card",
				children: quotes.map((quote) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencyRow, { quote }, quote.code))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBar, { snapshot })
		]
	});
}
//#endregion
export { WatchlistPage as component };
