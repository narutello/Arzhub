import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as Route$3 } from "./router-CSzsPqoA.mjs";
import { T as useMarket, c as LoadingBoard, d as OfflineBanner, h as StaleBanner, m as SourceBar, o as ErrorState } from "./states-CN6enomQ.mjs";
import { t as Converter } from "./converter-4K1DR4Mp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/convert-t-yjgz81.js
var import_jsx_runtime = require_jsx_runtime();
function ConvertPage() {
	const initial = Route$3.useLoaderData();
	const { snapshot, error, stale, offline, isLoading, refetch } = useMarket(initial);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingBoard, {});
	if (!snapshot) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error ?? "برای تبدیل ارز به نرخ به‌روز نیاز است.",
		onRetry: () => {
			refetch();
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "تبدیل ارز"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "محاسبه بر اساس آخرین نرخ بازار آزاد. همه مقادیر به تومان قابل تبدیل‌اند."
				})]
			}),
			offline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfflineBanner, {}) : null,
			stale && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaleBanner, { message: error }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Converter, { quotes: snapshot.quotes }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBar, { snapshot })
		]
	});
}
//#endregion
export { ConvertPage as component };
