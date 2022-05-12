import { get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"
import { getRegisteredInfoParams, getRegisteredListParams, loginParams } from "@/interfaces/params.interface"
import { baseRes, PageData, registeredListData, UserexhibitionData } from "@/interfaces/api.interface"

export default {
	// --------用户相关接口
	// 系统用户登录接口
	loginIn(params: loginParams) {
		return post<any>({
			url: `${urlFunc.requestHost()}/login`,
			params
		})
	},
	getUserInfo(params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/admin/user/currentUser`,
			params
		})
	},
	// 注册用户列表
	getRegisteredList(params: getRegisteredListParams) {
		return get<baseRes<PageData<registeredListData>>>({
			url: `${urlFunc.requestHost()}/admin/account/list`,
			params
		})
	},
	// 注册用户详情
	getRegisteredInfo(params: getRegisteredInfoParams) {
		return get<baseRes<registeredListData>>({
			url: `${urlFunc.requestHost()}/admin/account/info`,
			params
		})
	},
	// 导出excel
	exportExcel(params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/admin/account/exportUser`,
			params
		})
	},
  // 生成验证码 
  generateCode() {
		return get<any>({
			url: `${urlFunc.requestHost()}/generateCode`,
		})
	}
}
