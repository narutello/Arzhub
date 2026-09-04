import { i as __toESM } from "../_runtime.mjs";
import { t as CACHE_KEY } from "./types-CWELa7eF.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as Star, o as SearchX, s as RefreshCw, t as WifiOff, u as CloudOff } from "../_libs/lucide-react.mjs";
import { c as cn, s as Button, u as getRates } from "./router-CSzsPqoA.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/states-CN6enomQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function readLocalSnapshot() {
	try {
		const raw = localStorage.getItem(CACHE_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function useMarket(initial) {
	const [offline, setOffline] = (0, import_react.useState)(false);
	const [local, setLocal] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setOffline(typeof navigator !== "undefined" ? !navigator.onLine : false);
		setLocal(readLocalSnapshot());
		const on = () => setOffline(false);
		const off = () => setOffline(true);
		window.addEventListener("online", on);
		window.addEventListener("offline", off);
		return () => {
			window.removeEventListener("online", on);
			window.removeEventListener("offline", off);
		};
	}, []);
	const query = useQuery({
		queryKey: ["rates"],
		queryFn: () => getRates(),
		initialData: initial,
		refetchInterval: 6e4,
		staleTime: 45e3
	});
	(0, import_react.useEffect)(() => {
		const snap = query.data?.snapshot;
		if (query.data?.ok && snap) try {
			localStorage.setItem(CACHE_KEY, JSON.stringify(snap));
		} catch {}
	}, [query.data]);
	const snapshot = query.data?.snapshot ?? local;
	return {
		snapshot,
		error: query.data?.error ?? (query.isError ? "قیمت‌ها به‌روزرسانی نشد." : null),
		stale: Boolean(query.data && !query.data.ok && snapshot),
		offline,
		isLoading: !snapshot && query.isLoading,
		refetch: query.refetch,
		isFetching: query.isFetching
	};
}
var FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function toFaDigits(value) {
	return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);
}
function formatNumber(value, decimals = 0) {
	if (!Number.isFinite(value)) return "—";
	return toFaDigits(value.toLocaleString("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}));
}
function formatToman(value, decimals = 0) {
	return formatNumber(Math.round(value * 10 ** decimals) / 10 ** decimals, decimals);
}
function formatSigned(value, decimals = 0) {
	if (!Number.isFinite(value) || value === 0) return formatNumber(0, decimals);
	return (value > 0 ? "+" : "−") + formatNumber(Math.abs(value), decimals);
}
function formatPercent(value) {
	if (!Number.isFinite(value)) return "—";
	const abs = Math.abs(value);
	const body = formatNumber(abs, abs >= 10 ? 1 : 2);
	if (value > 0) return `٪${body}+`;
	if (value < 0) return `٪${body}−`;
	return `٪${body}`;
}
var tehranDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
	timeZone: "Asia/Tehran",
	weekday: "long",
	day: "numeric",
	month: "long",
	year: "numeric"
});
var tehranTime = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
	timeZone: "Asia/Tehran",
	hour: "2-digit",
	minute: "2-digit"
});
var tehranShort = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
	timeZone: "Asia/Tehran",
	day: "numeric",
	month: "short"
});
function formatTehranDate(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return tehranDate.format(d);
}
function formatTehranTime(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return tehranTime.format(d);
}
function formatChartTick(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return tehranShort.format(d);
}
function PriceValue({ value, decimals = 0, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular-nums tracking-tight", className),
		children: formatToman(value, decimals)
	});
}
function ChangeBadge({ quote }) {
	const tone = quote.direction === "up" ? "text-up" : quote.direction === "down" ? "text-down" : "text-muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 tabular-nums text-sm", tone),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatSigned(quote.change, quote.currency.decimals) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			dir: "ltr",
			children: formatPercent(quote.changePercent)
		})]
	});
}
function CodeMark({ code }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "flex size-10 shrink-0 items-center justify-center rounded-md bg-card-2 text-[0.6875rem] font-semibold tracking-wide text-foreground",
		children: code
	});
}
var DEFAULTS = [
	"USD",
	"EUR",
	"AED",
	"TRY"
];
var useWatchlist = create()(persist((set, get) => ({
	codes: DEFAULTS,
	hydrated: false,
	toggle: (code) => {
		const next = code.toUpperCase();
		set((s) => ({ codes: s.codes.includes(next) ? s.codes.filter((c) => c !== next) : [next, ...s.codes] }));
	},
	has: (code) => get().codes.includes(code.toUpperCase()),
	setHydrated: () => set({ hydrated: true })
}), {
	name: "arzhub-watchlist",
	partialize: (s) => ({ codes: s.codes }),
	onRehydrateStorage: () => (state) => {
		state?.setHydrated();
	}
}));
function StarButton({ code, className }) {
	const has = useWatchlist((s) => s.codes.includes(code));
	const toggle = useWatchlist((s) => s.toggle);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	const filled = ready && has;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		type: "button",
		variant: "ghost",
		size: "icon-sm",
		className: cn("shrink-0", className),
		"aria-pressed": filled,
		"aria-label": filled ? "حذف از نشان‌شده" : "افزودن به نشان‌شده",
		onClick: (e) => {
			e.preventDefault();
			e.stopPropagation();
			toggle(code);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
			className: cn("size-4", filled && "fill-foreground"),
			strokeWidth: 1.75
		})
	});
}
function CurrencyRow({ quote }) {
	const unit = quote.currency.quoteUnitLabel;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/currencies/$code",
		params: { code: quote.code.toLowerCase() },
		className: "flex min-h-16 items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarButton, { code: quote.code }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeMark, { code: quote.code }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-medium",
						children: quote.currency.nameFa
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceValue, {
						value: quote.price,
						decimals: quote.currency.decimals,
						className: "text-[1.05rem] font-semibold"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-0.5 flex items-center justify-between gap-3 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [quote.currency.nameEn, unit ? ` · ${unit}` : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { quote })]
				})]
			})
		]
	});
}
function HeroCard({ quote }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/currencies/$code",
		params: { code: quote.code.toLowerCase() },
		className: "flex flex-col gap-3 rounded-xl bg-card p-4 shadow-card transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: quote.code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-medium",
					children: quote.currency.nameFa
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarButton, { code: quote.code })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-3xl font-semibold leading-none tracking-tight",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceValue, {
					value: quote.price,
					decimals: quote.currency.decimals
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { quote }), quote.high != null && quote.low != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted tabular-nums",
					children: [
						formatToman(quote.low, quote.currency.decimals),
						" –",
						" ",
						formatToman(quote.high, quote.currency.decimals)
					]
				}) : null]
			})
		]
	});
}
function rangePct(q) {
	if (q.high == null || q.low == null || q.low <= 0) return 0;
	return (q.high - q.low) / q.low * 100;
}
function SourceBar({ snapshot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"منبع:",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: snapshot.sourceUrl,
				className: "text-foreground underline-offset-4 hover:underline",
				target: "_blank",
				rel: "noreferrer",
				children: snapshot.sourceName
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			"آخرین به‌روزرسانی: ",
			formatTehranDate(snapshot.fetchedAt),
			"،",
			" ",
			formatTehranTime(snapshot.fetchedAt)
		] })]
	});
}
function MarketStatus({ snapshot }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-4 py-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-x-3 gap-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: "بازار آزاد تهران"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: snapshot.marketOpen ? "rounded-full bg-up/12 px-2 py-0.5 text-xs text-up" : "rounded-full bg-card-2 px-2 py-0.5 text-xs text-muted",
				children: snapshot.marketOpen ? "آخرین نرخ جاری" : "تعطیل / آخرین جلسه"
			})]
		}), snapshot.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: snapshot.note
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "قیمت‌ها به تومان است. هر تومان برابر ۱۰ ریال."
		})]
	});
}
function MoverList({ title, quotes, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-card p-4 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-medium",
			children: title
		}), quotes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: empty
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: quotes.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/currencies/$code",
				params: { code: q.code.toLowerCase() },
				className: "flex items-center gap-3 rounded-md py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeMark, { code: q.code }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1 truncate text-sm",
						children: q.currency.nameFa
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceValue, {
							value: q.price,
							decimals: q.currency.decimals,
							className: "block text-sm font-medium"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, { quote: q })]
					})
				]
			}) }, q.code))
		})]
	});
}
function Movers({ quotes }) {
	const gainers = quotes.filter((q) => q.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
	const losers = quotes.filter((q) => q.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
	if (gainers.length === 0 && losers.length === 0) {
		const volatile = [...quotes].sort((a, b) => rangePct(b) - rangePct(a)).slice(0, 4);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoverList, {
			title: "بیشترین نوسان روزانه",
			quotes: volatile,
			empty: "نوسان معناداری ثبت نشده است."
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoverList, {
			title: "بیشترین افزایش",
			quotes: gainers,
			empty: "امروز افزایشی ثبت نشده است."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoverList, {
			title: "بیشترین کاهش",
			quotes: losers,
			empty: "امروز کاهشی ثبت نشده است."
		})]
	});
}
function FeaturedGrid({ quotes }) {
	const featured = quotes.filter((q) => q.currency.featured).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-3",
		children: featured.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCard, { quote: q }, q.code))
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("skeleton rounded-md", className) });
}
function LoadingBoard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		"aria-busy": "true",
		"aria-label": "در حال بارگذاری قیمت‌ها",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-xl" }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-lg" }, i))
			})
		]
	});
}
function ErrorState({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-12 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudOff, {
				className: "size-8 text-down",
				strokeWidth: 1.5
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-medium",
				children: "قیمت‌ها به‌روزرسانی نشد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted",
				children: message
			}),
			onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				onClick: onRetry,
				className: "mt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), "تلاش دوباره"]
			}) : null
		]
	});
}
function EmptySearch({ query }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-12 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchX, {
				className: "size-8 text-subtle",
				strokeWidth: 1.5
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-medium",
				children: "ارزی پیدا نشد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"نتیجه‌ای برای «",
					query,
					"» در فهرست ارزهاب نیست."
				]
			})
		]
	});
}
function EmptyWatchlist() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-2 rounded-xl bg-card px-6 py-12 text-center shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-base font-medium",
			children: "فهرست شما خالی است"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-sm text-sm text-muted",
			children: "با زدن ستاره کنار هر ارز، آن را به دیدهٔ خود اضافه کنید. این فهرست روی همین دستگاه ذخیره می‌شود."
		})]
	});
}
function OfflineBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-md bg-card-2 px-3 py-2 text-sm text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, {
			className: "size-4 shrink-0",
			strokeWidth: 1.75
		}), "اتصال اینترنت قطع است. آخرین قیمت ذخیره‌شده نمایش داده می‌شود."]
	});
}
function StaleBanner({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-card-2 px-3 py-2 text-sm text-muted",
		children: [message, " — آخرین نرخ موفق نمایش داده می‌شود."]
	});
}
//#endregion
export { formatToman as C, useWatchlist as E, formatTehranTime as S, useMarket as T, formatChartTick as _, EmptyWatchlist as a, formatSigned as b, LoadingBoard as c, OfflineBanner as d, PriceValue as f, StarButton as g, StaleBanner as h, EmptySearch as i, MarketStatus as l, SourceBar as m, CodeMark as n, ErrorState as o, Skeleton as p, CurrencyRow as r, FeaturedGrid as s, ChangeBadge as t, Movers as u, formatNumber as v, toFaDigits as w, formatTehranDate as x, formatPercent as y };
