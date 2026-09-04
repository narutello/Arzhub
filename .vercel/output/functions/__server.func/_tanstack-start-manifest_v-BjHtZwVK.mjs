//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-BjHtZwVK.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/convert",
			"/currencies",
			"/watchlist"
		],
		preloads: [
			"/assets/index-DVeLvQlG.js",
			"/assets/rolldown-runtime-hePW80VL.js",
			"/assets/preload-helper-jDhmO9tI.js",
			"/assets/currencies-6qjt2Z3p.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-DVeLvQlG.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-QalsZk_b.js",
			"/assets/states-BfexSWoj.js",
			"/assets/search-HJ95-SP-.js",
			"/assets/input-kgHMVpIj.js",
			"/assets/converter-SKPeXGUI.js"
		]
	},
	"/convert": {
		filePath: "/workspace/src/routes/convert.tsx",
		children: void 0,
		preloads: [
			"/assets/convert-bdO-VfzR.js",
			"/assets/states-BfexSWoj.js",
			"/assets/converter-SKPeXGUI.js"
		]
	},
	"/currencies": {
		filePath: "/workspace/src/routes/currencies.tsx",
		children: ["/currencies/$code"],
		preloads: [
			"/assets/currencies-BCVNKmpY.js",
			"/assets/states-BfexSWoj.js",
			"/assets/search-HJ95-SP-.js",
			"/assets/input-kgHMVpIj.js"
		]
	},
	"/watchlist": {
		filePath: "/workspace/src/routes/watchlist.tsx",
		children: void 0,
		preloads: ["/assets/watchlist-C8G74mmh.js", "/assets/states-BfexSWoj.js"]
	},
	"/currencies/$code": {
		filePath: "/workspace/src/routes/currencies.$code.tsx",
		children: void 0,
		preloads: ["/assets/currencies._code-cEQk7Fzw.js", "/assets/converter-SKPeXGUI.js"]
	}
} });
//#endregion
export { tsrStartManifest };
