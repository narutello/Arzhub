import { i as __toESM } from "../_runtime.mjs";
import { r as CONVERTIBLE } from "./types-CWELa7eF.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as ArrowLeftRight } from "../_libs/lucide-react.mjs";
import { c as cn, s as Button } from "./router-CSzsPqoA.mjs";
import { C as formatToman, v as formatNumber, w as toFaDigits } from "./states-CN6enomQ.mjs";
import { t as Input } from "./input-DlntZo-x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/converter-4K1DR4Mp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function unitPrice(quote, currency) {
	if (currency.code === "IRT") return 1;
	if (!quote) return null;
	return quote.price / currency.quoteUnit;
}
function Converter({ quotes, defaultFrom = "USD", defaultTo = "IRT" }) {
	const [from, setFrom] = (0, import_react.useState)(defaultFrom);
	const [to, setTo] = (0, import_react.useState)(defaultTo);
	const [amount, setAmount] = (0, import_react.useState)("1");
	const byCode = (0, import_react.useMemo)(() => Object.fromEntries(quotes.map((q) => [q.code, q])), [quotes]);
	const fromCur = CONVERTIBLE.find((c) => c.code === from) ?? CONVERTIBLE[1];
	const toCur = CONVERTIBLE.find((c) => c.code === to) ?? CONVERTIBLE[0];
	const numeric = Number(amount.replace(/,/g, "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))));
	const fromPrice = unitPrice(byCode[fromCur.code], fromCur);
	const toPrice = unitPrice(byCode[toCur.code], toCur);
	let result = null;
	if (Number.isFinite(numeric) && fromPrice && toPrice) result = numeric * fromPrice / toPrice;
	const fromOptions = CONVERTIBLE.filter((c) => c.code === "IRT" || byCode[c.code]);
	function swap() {
		setFrom(to);
		setTo(from);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card p-4 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-medium",
				children: "تبدیل ارز"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "مبنای محاسبه: تومان"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "grid gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "مقدار"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "decimal",
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						className: "tabular-nums"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_auto_1fr] items-end gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencySelect, {
							label: "از",
							value: from,
							options: fromOptions,
							onChange: setFrom
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							"aria-label": "جابه‌جایی",
							onClick: swap,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CurrencySelect, {
							label: "به",
							value: to,
							options: fromOptions,
							onChange: setTo
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg bg-card-2 px-4 py-4",
					children: result == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "برای این جفت‌ارز نرخی در دسترس نیست."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							toFaDigits(amount || "0"),
							" ",
							fromCur.nameFa,
							" برابر است با"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-2xl font-semibold tabular-nums tracking-tight",
						children: [
							toCur.code === "IRT" ? formatToman(result, 0) : formatNumber(result, result >= 100 ? 2 : 4),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-medium text-muted",
								children: toCur.nameFa
							})
						]
					})] })
				})
			]
		})]
	});
}
function CurrencySelect({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: cn("h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"),
			children: options.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: c.code,
				children: [
					c.code,
					" — ",
					c.nameFa
				]
			}, c.code))
		})]
	});
}
//#endregion
export { Converter as t };
