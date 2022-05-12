import { get, post } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	demo(params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/demo`,
			params
		})
	},
	fileupload(params: any) {
		return post<any>({
			url: `${urlFunc.requestHost()}/file`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	documentUpload(params: any) {
		return post<any>({
			url: `${urlFunc.requestHost()}/common/product/importProduct`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	}
}
