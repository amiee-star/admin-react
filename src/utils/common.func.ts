import { event, LANG_CHANGE_EVENT } from "@@/plugin-locale/locale"

import qs from "qs"
import { addLocale, getLocale } from "umi"
export default {
	//取小数点
	toFixed: (value: number, length: number = 2) => {
		return Number.prototype.toFixed.call(value || 0, length)
	},
	//动态添加语言
	addLocaleSync: (lang: "zh-CN" | "en-US" | string, message: Object) => {
		addLocale(
			lang,
			{ ...message },
			{
				momentLocale: lang,
				antd: ""
			}
		)
		event.emit(LANG_CHANGE_EVENT, getLocale())
	},
	browser: () => {
		const userAgent = navigator.userAgent
		return {
			trident: userAgent.indexOf("Trident") > -1, //IE内核
			presto: userAgent.indexOf("Presto") > -1, //opera内核
			webKit: userAgent.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
			gecko: userAgent.indexOf("Gecko") > -1 && userAgent.indexOf("KHTML") == -1, //火狐内核
			mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1, //android终端
			iPhone: userAgent.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
			iPad: userAgent.indexOf("iPad") > -1, //是否iPad
			webApp: userAgent.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
			weixin: userAgent.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
			qq: !!userAgent.match(/\sQQ/i) //是否QQ
		}
	},
	//获取OSS素材地址
	compressUrl: (url: string, width: number = 500) => {
		const urls = url.split("?")
		const [realUrl, urlParams] = urls
		const realParams = !!urlParams ? qs.parse(urlParams) : {}
		const ossParams = `image/resize,w_${width}`
		return `${realUrl}?${qs.stringify({
			...realParams,
			width,
			"x-oss-process": ossParams,
			"x-image-process": ossParams
		})}`
	},
	dataURLtoFile(baseUrl: string, fileName: string) {
		const checkData = baseUrl.split(",")
		const type = checkData[0].match(/:(.*?);/)[1]
		const bstr = atob(checkData[1])
		let len = bstr.length
		const u8arr = new Uint8Array(len)
		while (len--) {
			u8arr[len] = bstr.charCodeAt(len)
		}
		return new File([u8arr], fileName, { type })
	},
	getUrl(file: File) {
		let url: string
		if ("createObjectURL" in window) {
			url = window["createObjectURL"](file)
		} else if (window.URL != undefined) {
			url = window.URL.createObjectURL(file)
		} else if (window.webkitURL != undefined) {
			url = window.webkitURL.createObjectURL(file)
		}
		return url
	}
}
