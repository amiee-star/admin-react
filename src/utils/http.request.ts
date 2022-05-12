import { baseRes, userData } from "@/interfaces/api.interface"
import { message } from "antd"
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import Qs from "qs"
import lsFunc from "./ls.func"

interface RequestOption<D> extends AxiosRequestConfig {
	url: string
	params?: D
}

function creatAxios(config: AxiosRequestConfig) {
	const defaultConf: AxiosRequestConfig = {
		baseURL: process.env.NODE_ENV === "production" ? "" : "/",
		timeout: 30 * 60 * 1000
	}
	const axiosInstance = Axios.create(Object.assign({}, defaultConf, config))
	axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
		const { headers = {} } = config
		const token = lsFunc.getItem("token")
		// const menuId = 1
		if (token) {
			headers.token = lsFunc.getItem("token")
			headers.menuId = 1
		}
		if (!!location.search.split("exhibitionId=")[1]) {
			headers.exhibitionId = location.search.split("exhibitionId=")[1]
		}
		return { ...config, headers }
	})
	axiosInstance.interceptors.response.use(value => {
		if (typeof value.data != "object" && value.data) {
			return value.data
		}
		let result: AxiosResponse<baseRes<any>> = Object.assign({}, value)
		Object.keys(value.data).forEach(key => {
			result.data[key.toLocaleLowerCase()] = value.data[key]
		})
		if (result.data.code == 200 || !("code" in result.data)) {
			return result
		} else {
			const { code, msg: errMsg } = result.data
			if (code === -1000 || code === 1007) {
				lsFunc.clearItem()
				location.href = "/auth/login.html"
			}
			message.error(errMsg)
			throw { code, message: errMsg }
		}
	})
	return axiosInstance
}

export async function get<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).get<R>(url, {
			params,
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
export async function postJson<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export async function patch<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign(
			{
				headers: {
					"Access-Control-Allow-Headers": "content-type,x-requested-with,Authorization"
				}
			},
			config
		)
		let ajax = await creatAxios(config).patch<R>(url, {
			...params,
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export async function put<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).put<R>(url, {
			...params,
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
export async function del<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).delete<R>(url, {
			params,
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}

export async function post<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign({ headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } }, config)
		if (!config.headers["Content-Type"].includes("multipart")) {
			config.transformRequest = [data => !!data && Qs.stringify(data)]
		}

		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
