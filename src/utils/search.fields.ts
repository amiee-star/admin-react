import { FieldItem, OptionItem } from "@/components/form/form.search"
import cityOptions from "@/components/utils/pca-code"
import serviceData from "@/services/service.data"
import serviceManage from "@/services/service.manage"
import serviceSys from "@/services/service.sys"
import { useState } from "react"
const asyncData = (apiService?: () => Promise<any>, keyArr: string[] = ["txt", "value"]) => async (): Promise<
	OptionItem[]
> => {
	let optionList = await apiService()
	let data = optionList.data.map((item: any) => {
		return {
			value: item[keyArr[0]],
			txt: item[keyArr[1]]
		}
	})
	data.unshift({ txt: "全部", value: "0" })
	return data
}
// const tradeClassDataTwo = useState([])
const tradeClassData = (apiService?: () => Promise<any>, keyArr: string[] = ["txt", "value"]) => async (): Promise<
	OptionItem[]
> => {
	let optionList = await serviceData.getTradeClass({ pid: 0 })

	let data = optionList.data.map((item: any) => {
		return {
			value: item.id,
			txt: item.title,
			key: item.id
		}
	})
	data.unshift({ txt: "全部", value: "0", key: "0000000" })
	return data
}

const getSensitive = (apiService?: () => Promise<any>, keyArr: string[] = ["txt", "value"]) => async (): Promise<
	OptionItem[]
> => {
	let optionList = await serviceSys.getSensitiveClass({ dictType: "sensitive_word" })

	let data = optionList.data.map((item: any) => {
		return {
			value: item.id,
			txt: item.dictValue,
			key: item.id
		}
	})
	data.unshift({ txt: "全部", value: "0", key: "0000000" })
	return data
}
const informationName = (apiService?: () => Promise<any>, keyArr: string[] = ["txt", "value"]) => async (): Promise<
	OptionItem[]
> => {
	let optionList = await serviceSys.informationListName({})

	let data = optionList.data.map((item: any) => {
		return {
			value: item.id,
			txt: item.title,
			key: item.id
		}
	})
	data.unshift({ txt: "全部", value: null, key: "0000000" })
	console.log(optionList)
	return data
}

const searchFiels: Record<string, FieldItem> = {
	id: {
		name: "id",
		title: "ID",
		type: "text"
	},

	aliStatic: {
		name: "aliStatic",
		title: "发布状态",
		type: "select",
		data: [
			{
				value: 0,
				txt: "未发布"
			},
			{
				value: 1,
				txt: "发布中"
			},
			{
				value: 2,
				txt: "已发布"
			},
			{
				value: 3,
				txt: "有修改"
			}
		]
	},
	userName: {
		name: "userName",
		title: "用户名",
		type: "text",
		value: "用户名"
	},
	userKeyword: {
		name: "userName",
		title: "请输入账号名",
		value: "关键词：",
		type: "text"
	},
	logKeyword: {
		name: "key",
		title: "请输入姓名/账号名",
		value: "关键词：",
		type: "text"
	},
	mobile: {
		name: "mobile",
		title: "请输入手机号搜索",
		type: "text",
		value: "手机号：",
		width: 200
	},
	name: {
		name: "name",
		title: "请输入创建人名称",
		type: "text",
		value: "姓名：",
		width: 200
	},
	company: {
		name: "company",
		title: "请输入单位名称",
		type: "text",
		value: "单位：",
		width: 200
	},
	source: {
		name: "source",
		title: "注册渠道：",
		type: "select",
		value: "注册渠道：",
		width: 200,
		data: [
			{
				value: 1,
				txt: "PC"
			},
			{
				value: 2,
				txt: "小程序"
			},
			{
				value: 3,
				txt: "h5"
			}
		]
	},
	city: {
		name: "city",
		title: "请选择省市区",
		type: "cascader",
		value: "区域：",
		option: cityOptions
	},
	signTime: {
		name: "time",
		title: "登录时间",
		type: "rangeDate",
		showTime: true
	},
	time: {
		name: "time",
		title: "注册时间",
		type: "rangeDate"
	},
	// 展会管理 start
	showKeyword: {
		name: "title",
		title: "请输入展会名称",
		type: "text",
		value: "展会名称：",
		width: 200
	},
	showStatus: {
		name: "state",
		title: "展会状态:",
		type: "select",
		value: "请选择展会状态",

		width: 200,
		data: [
			{
				value: 0,
				txt: "未开始"
			},
			{
				value: 1,
				txt: "进行中"
			},
			{
				value: 2,
				txt: "已结束"
			}
		]
	},
	showWebStatus: {
		name: "webState",
		title: "网页状态：",
		type: "select",
		value: "请选择网页状态",
		width: 200,
		data: [
			{
				value: 0,
				txt: "下架"
			},
			{
				value: 1,
				txt: "上架"
			}
		]
	},
	showIsDef: {
		name: "isDef",
		title: "是否默认：",
		type: "select",
		value: "请选择是否默认",
		width: 200,
		data: [
			{
				value: 0,
				txt: "否"
			},
			{
				value: 1,
				txt: "是"
			}
		]
	},
	showTimes: {
		name: "times",
		title: "展会时间：",
		type: "rangeDate",
		width: 200
	},
	// 展会管理 end
	// 基础数据 start
	dataKeyWord: {
		name: "dataKeyWord",
		title: "请输入产品名称/订货单号",
		type: "text",
		value: "关键字：",
		width: 200
	},
	productType: {
		name: "productType",
		title: "产品分类",
		type: "select",
		value: "产品分类：",
		width: 200,
		data: [
			{
				value: 0,
				txt: "分类1"
			},
			{
				value: 1,
				txt: "分类2"
			}
		]
	},
	productStatus: {
		name: "productStatus",
		title: "产品状态",
		type: "select",
		value: "产品状态：",
		width: 200,
		data: [
			{
				value: 0,
				txt: "分类1"
			},
			{
				value: 1,
				txt: "分类2"
			}
		]
	},
	tradeStatus: {
		name: "tradeStatus",
		title: "产品状态",
		type: "select",
		value: "产品状态：",
		width: 200,
		data: [
			{
				value: -1,
				txt: "待上架"
			},
			{
				value: 0,
				txt: "已上架"
			},
			{
				value: 1,
				txt: "已下架"
			}
		]
	},
	tradeTime: {
		name: "time",
		title: "创建时间",
		type: "rangeDate"
	},
	tradeOne: {
		name: "industryId",
		title: "行业分类一",
		type: "select",
		value: "行业分类一",
		width: 200,
		data: tradeClassData()
	},
	tradeTwo: {
		name: "solutionId",
		title: "行业分类二",
		type: "select",
		value: "行业分类二",
		width: 200,
		data: []
	},
	// 基础数据 end

	//--------------展会管理---------------------
	//3D导览岛设置
	hotspotStatus: {
		name: "state",
		title: "状态",
		type: "select",
		value: "状态",
		data: [
			{
				value: 1,
				txt: "开启"
			},
			{
				value: 0,
				txt: "关闭"
			}
		]
	},
	//展会流程
	flowpathTime: {
		name: "time",
		title: "时间范围",
		type: "rangeDate"
	},
	exhibitionNewsSearch: {
		name: "title",
		title: "请输入资讯标题",
		type: "text"
	},
	exhibitionPicSearch: {
		name: "title",
		title: "请输入图片名称",
		type: "text"
	},
	highlightSearch: {
		name: "title",
		title: "请输入视频名称",
		type: "text"
	},
	partnerSearch: {
		name: "title",
		title: "请输入媒体名称",
		type: "text"
	},
	setBannerSearch: {
		name: "title",
		title: "请输入Banner名称",
		type: "text"
	},
	//敏感词
	sensitiveCreator: {
		name: "key",
		title: "请输入敏感词名称",
		value: "关键词：",
		type: "text"
	},
	sensitiveType: {
		name: "typeId",
		title: "分类",
		type: "select",
		value: "全部",
		data: getSensitive()
	},
	sensitiveTime: {
		name: "startTime",
		title: "创建时间",
		type: "rangeDate"
	},
	//留言搜索
	exhibitType: {
		name: "exhibitionId",
		title: "展会名称",
		type: "select",
		value: "全部",
		data: informationName()
	},
	informationKey: {
		name: "name",
		title: "请输入留言人姓名",
		value: "关键字",
		type: "text"
	},
	informationTel: {
		name: "mobile",
		title: "请输入用户手机号",
		value: "手机号",
		type: "text"
	},
	informationTime: {
		name: "startTime",
		title: "创建时间",
		type: "rangeDate"
	},
	investkeyword: {
		name: "keyword",
		title: "请输入问卷名",
		value: "关键字",
		type: "text"
	},
	investStatus: {
		name: "status",
		title: "状态",
		type: "select",
		value: "状态",
		data: [
			{
				value: 1,
				txt: "上架"
			},
			{
				value: 0,
				txt: "下架"
			},
			{
				value: -1,
				txt: "待上架"
			}
		]
	},
	investTime: {
		name: "createDate",
		title: "创建时间",
		type: "rangeDate"
	},
	keyword: {
		name: "keyWord",
		title: "请输入姓名/手机号",
		value: "关键字",
		type: "text"
	},
	timeRange: {
		name: "startTime",
		title: "时间范围",
		type: "rangeDate"
	},
	signUpRange: {
		name: "startTime",
		title: "报名时间",
		type: "rangeDate"
	},

	invitKeyword: {
		name: "keyword",
		title: "邀请函名称/模板名称/创建人",
		value: "关键字",
		type: "text"
	},
	invitStatus: {
		name: "state",
		title: "状态",
		type: "select",
		value: "状态",
		data: [
			{
				value: 0,
				txt: "待发布"
			},
			{
				value: 1,
				txt: "已发布"
			},
			{
				value: 2,
				txt: "禁用"
			}
		]
	},
	renyuankeyword: {
		name: "keyWord",
		title: "请输入关键字",
		value: "关键字",
		type: "text"
	},
	drawName: {
		name: "name",
		title: "请输入抽奖活动名称",
		value: "抽奖活动名称",
		type: 'text'
	},
	drawState: {
		name: "state",
		title: "状态",
		type: "select",
		value: "启用/禁用",
		data: [
			{
				value: 0,
				txt: "已禁用"
			},
			{
				value: 1,
				txt: "已启用"
			}
		]
	},

	winPhone : {
		name: "mobile",
		title: "请输入中奖人手机号",
		value: "中奖人手机号",
		type: 'text'	
	}


}
export default searchFiels
export function returnSearchFiels(keys: string[]) {
	return keys.map(key => {
		if (!searchFiels[key]) {
			throw new Error(`无${key}字段配置`)
		}
		return searchFiels[key]
	})
}
