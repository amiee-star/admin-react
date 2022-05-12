import { defineConfig, IConfig } from "umi"
import ProxyConfig from "./proxy"
function buildProxy() {
	const proxyList = {} as Record<string, any>
	Object.keys(ProxyConfig).forEach(it => {
		proxyList[`/${it}`] = {
			target: ProxyConfig[it][process.env.API_ENV || "test"],
			changeOrigin: true,
			pathRewrite: { [`^/${it}`]: "" }
		}
	})
	return proxyList
}

export default defineConfig({
	base: "./",
	outputPath: "./admin-dist/",
	proxy: buildProxy(),
	exportStatic: {
		htmlSuffix: true,
		dynamicRoot: true
	},
	history: {
		type: "browser"
	},
	ignoreMomentLocale: true,
	mountElementId: "app",
	runtimePublicPath: true,
	hash: true,
	chunks: ["rule3D"],
	chainWebpack: conf => {
		const entryVal = conf.entry("umi").values()
		conf.entryPoints
			.delete("umi")
			.end()
			.entry("rule3D")
			.merge(entryVal)
			.end()
			.module.rule("no-use-base64")
			.test(/no64/i)
			.use("file-loader")
			.loader("file-loader")
			.options({
				name: "static/[name]-[hash:8].[ext]"
			})
	},
	define: {
		API_ENV: process.env.API_ENV || "test"
	},
	dynamicImport: {},
	locale: {
		antd: true,
		title: true,
		baseNavigator: true,
		baseSeparator: "-"
	},
	dva: false
} as IConfig)
