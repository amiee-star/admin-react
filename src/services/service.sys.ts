import { get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"
import {
	addDicItemParams,
	addDicParams,
	addExhibitionParams,
	addRoleParams,
	addSensitive,
	addUserParams,
	delDicItemParams,
	delDicParams,
	delExhibitionParams,
	delRoleParams,
	delSensitive,
	delUserParams,
	getDicItemParams,
	getDicListParams,
	getExhibitionInfoParams,
	getExhibitionListData,
	getLogParams,
	getRoleInfoParams,
	getRoleParams,
	getSensitive,
	getSensitiveById,
	getSensitiveClass,
	getShowStatusParams,
	getUserexhibitionParams,
	getUserInfoParams,
	infoId,
	informationList,
	informationListName,
	informationName,
	investId,
	setDefShowParams,
	showStatusData,
	signItem,
	updateDicItemParams,
	updateDicParams,
	updateExhibitionParams,
	updateRoleParams,
	updateUserParams,
	userListParams
} from "@/interfaces/params.interface"
import {
	baseRes,
	PageData,
	dicListData,
	UserexhibitionData,
	dicItemData,
	roleData,
	RoleInfoData,
	userListData,
	userInfoData,
	getLogData,
	ExhibitionListData,
	investData,
	sumInvestData,
	wendatiList,
	invitationTemplateList
} from "@/interfaces/api.interface"
export default {
	// --------系统管理相关接口
	getUserexhibition(params: getUserexhibitionParams) {
		return get<baseRes<UserexhibitionData>>({
			url: `${urlFunc.requestHost()}/exhibition/admin/listByUserId`,
			params
		})
	},
	//字典类型数据请求
	getDictionaryList(params: getDicListParams) {
		return get<baseRes<dicListData>>({
			url: `${urlFunc.requestHost()}/admin/dicttype/list`,
			params
		})
	},
	//新增字典类型数据
	addDictionaryList(params: addDicParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/dicttype/create`,
			params
		})
	},
	//删除字典类型数据
	delDictionaryList(params: delDicParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/dicttype/delete`,
			params
		})
	},
	//编辑字典类型数据
	editDictionaryList(params: updateDicParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/dicttype/update`,
			params
		})
	},
	//字典项数据请求
	getDictionaryItem(params: getDicItemParams) {
		return get<baseRes<PageData<dicItemData>>>({
			url: `${urlFunc.requestHost()}/admin/dictdata/list`,
			params
		})
	},
	//新增字典项数据
	addDictionaryItem(params: addDicItemParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/dictdata/create`,
			params
		})
	},
	//编辑字典项数据
	editDictionaryItem(params: updateDicItemParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/dictdata/update`,
			params
		})
	},
	//删除字典项数据
	delDictionaryItem(params: delDicItemParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/dictdata/delete`,
			params
		})
	},
	//角色数据
	getRole(params: getRoleParams) {
		return get<baseRes<PageData<roleData>>>({
			url: `${urlFunc.requestHost()}/admin/role/list`,
			params
		})
	},
	// 获取单个角色数据
	getRoleInfo(params: getRoleInfoParams) {
		return get<baseRes<RoleInfoData>>({
			url: `${urlFunc.requestHost()}/admin/role/info`,
			params
		})
	},
	// 新增角色
	addRole(params: addRoleParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/role/create`,
			params
		})
	},
	// 编辑角色
	updateRole(params: updateRoleParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/role/update`,
			params
		})
	},
	// 删除角色
	deleteRole(params: delRoleParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/role/delete`,
			params
		})
	},
	//后台用户数据
	getUserList(params: userListParams) {
		return get<baseRes<PageData<userListData>>>({
			url: `${urlFunc.requestHost()}/admin/user/list`,
			params
		})
	},
	//获取后台指定数据
	getUserById(params: getUserInfoParams) {
		return get<baseRes<userInfoData>>({
			url: `${urlFunc.requestHost()}/admin/user/info`,
			params
		})
	},
	//添加用户数据
	addUser(params: addUserParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/user/create`,
			params
		})
	},
	//修改用户数据
	editUser(params: updateUserParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/user/update`,
			params
		})
	},
	//删除用户数据
	deleteUser(params: delUserParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/user/delete`,
			params
		})
	},
	//系统日志数据
	getLog(params: getLogParams) {
		return get<baseRes<PageData<getLogData>>>({
			url: `${urlFunc.requestHost()}/admin/log/list`,
			params
		})
	},
	//展会列表数据请求
	getExhibitionList(params: getExhibitionListData) {
		return get<baseRes<PageData<ExhibitionListData>>>({
			url: `${urlFunc.requestHost()}/exhibition/list`,
			params
		})
	},
	//单个展会数据请求
	getExhibition(params: getExhibitionInfoParams) {
		return get<baseRes<ExhibitionListData>>({
			url: `${urlFunc.requestHost()}/exhibition/info`,
			params
		})
	},
	//新增展会数据
	addExhibitionList(params: addExhibitionParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/create`,
			params
		})
	},
	//删除展会数据
	delExhibitionList(params: delExhibitionParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/delete`,
			params
		})
	},
	//编辑展会数据
	editExhibitionList(params: updateExhibitionParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/update`,
			params
		})
	},
	//设置为默认展会
	setDefaultShow(params: setDefShowParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/setDefault`,
			params
		})
	},
	// 菜单列表
	getMenuList(params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/admin/menu/permission`,
			params
		})
	},
	// 所有展会状态
	getShowStatus(params: getShowStatusParams) {
		return get<baseRes<showStatusData>>({
			url: `${urlFunc.requestHost()}/exhibition/getStateCount`,
			params
		})
	},
	//查询敏感词列表
	getSensitive(params: getSensitive) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/admin/sensitiveWord/page`,
			params
		})
	},
	//根据id查询敏感词
	getSensitiveById(params: getSensitiveById) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/admin/sensitiveWord/findById`,
			params
		})
	},
	//敏感词新增
	addSensitive(params: addSensitive) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/sensitiveWord/add`,
			params
		})
	},
	//敏感词修改
	setSensitive(params: addSensitive) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/sensitiveWord/update`,
			params
		})
	},
	//敏感词类型
	getSensitiveClass(params: getSensitiveClass) {
		return get<any>({
			url: `${urlFunc.requestHost()}/admin/dictdata/findByDictType`,
			params
		})
	},
	//批量删除
	delSensitive(params: delSensitive) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/sensitiveWord/delete`,
			params
		})
	},
	//展会留言
	informationList(params: informationList) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/admin/message/list`,
			params
		})
	},
	//展会名称
	informationListName(params: informationListName) {
		return get<any>({
			url: `${urlFunc.requestHost()}/exhibition/name`,
			params
		})
	},
	//单个展会名称
	informationName(params: informationName) {
		return get<any>({
			url: `${urlFunc.requestHost()}/exhibition/message/list`,
			headers: {
				exhibitionId: params.exhibitionId
			},
			params
		})
	},
	//系统管理-问卷调查列表

	Investigationlsit(params: investId) {
		return get<baseRes<PageData<investData>>>({
			url: `${urlFunc.requestHost()}/admin/questionnaire/list`,
			params
		})
	},
	//系统管理-问卷调查统计
	Investigationdetail(params: investId) {
		return get<baseRes<sumInvestData>>({
			url: `${urlFunc.requestHost()}/admin/questionnaire/statistical`,
			params
		})
	},
	wendatiList(params: infoId) {
		return get<baseRes<PageData<wendatiList>>>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/questionStatistical`,
			params
		})
	},
	//查询展会签到记录

	getSign(params: signItem) {
		return get<baseRes<PageData<wendatiList>>>({
			url: `${urlFunc.requestHost()}/admin/sign/list`,
			params
		})
	}
}
