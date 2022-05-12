import moment from "moment"
import { getLocale } from "umi"
declare global {
	const API_ENV: string
	interface Window {
		routerBase: string
		publicPath: string
	}
}

//moment跟随全局语言
moment.locale(getLocale())
