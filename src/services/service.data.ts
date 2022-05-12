import { get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"
import {
	getUserexhibitionParams,
	updateTradeParams,
	deleteTradesParams,
	getTradeParams,
	getTradeTreeParams,
	addTradeClassParams,
	updateTradeClassParams,
	delTradeClassParams,
	getProClassParams,
	getProTreeParams,
	addProClassParams,
	updateProClassParams,
	delProClassParams,
	getTradeDataParams,
	getTradeInfoParams,
	addTradeDataParams,
	getProDataParams,
	getProInfoParams,
	addProDataParams,
	updateProDataParams
} from "@/interfaces/params.interface"
import {
	baseRes,
	PageData,
	TradeClassList,
	TradeData,
	ProductData,
	proClassData,
	Creators
} from "@/interfaces/api.interface"
export default {
	// --------数据相关接口
	// 指定行业分类
	getTradeClass(params: getTradeParams) {
		return get<baseRes<TradeClassList[]>>({
			url: `${urlFunc.requestHost()}/common/industry/category/list`,
			params
		})
	},
	// 行业分类列表tree
	getTradeClassList(params: getTradeTreeParams) {
		return get<baseRes<TradeClassList[]>>({
			url: `${urlFunc.requestHost()}/common/industry/category/tree`,
			params
		})
	},
	// 新增行业分类
	addTradeClass(params: addTradeClassParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/industry/category/create`,
			params
		})
	},
	// 编辑行业分类
	updateTradeClass(params: updateTradeClassParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/industry/category/update`,
			params
		})
	},
	// 删除行业分类
	deleteTradeClass(params: delTradeClassParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/industry/category/delete`,
			params
		})
	},
	// 指定产品分类
	getProductClass(params: getProClassParams) {
		return get<baseRes<proClassData[]>>({
			url: `${urlFunc.requestHost()}/common/product/category/list`,
			params
		})
	},
	// 产品分类列表树形
	getProductClassList(params: getProTreeParams) {
		return get<baseRes<proClassData[]>>({
			url: `${urlFunc.requestHost()}/common/product/category/tree`,
			params
		})
	},
	// 新增产品分类
	addProductClass(params: addProClassParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/category/create`,
			params
		})
	},
	// 编辑产品分类
	updateProductClass(params: updateProClassParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/category/update`,
			params
		})
	},
	// 删除产品分类
	deleteProductClass(params: delProClassParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/category/delete`,
			params
		})
	},

	// 基础数据：行业
	getTradeData(params: getTradeDataParams) {
		return get<baseRes<PageData<TradeData>>>({
			url: `${urlFunc.requestHost()}/common/solution/page`,
			params
		})
	},
	// 查询指定行业基础数据
	getTradeDataById(params: getTradeInfoParams) {
		return get<baseRes<TradeData>>({
			url: `${urlFunc.requestHost()}/common/solution/findById`,
			params
		})
	},
	// 新增行业基础数据
	addTradeData(params: addTradeDataParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/solution/create`,
			params
		})
	},
	// 编辑行业基础数据
	updateTradeData(params: updateTradeParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/solution/update`,
			params
		})
	},
	// 批量删除行业基础数据
	deleteTradeDatas(params: deleteTradesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/solution/delete`,
			params
		})
	},
	// 批量上架行业基础数据
	upTradeDatas(params: deleteTradesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/solution/up`,
			params
		})
	},
	// 批量下架行业基础数据
	downTradeDatas(params: deleteTradesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/solution/down`,
			params
		})
	},

	// 基础数据产品
	getProductData(params: getProDataParams) {
		return get<baseRes<PageData<TradeData>>>({
			url: `${urlFunc.requestHost()}/common/product/page`,
			params
		})
	},
	// 查询指定产品基础数据
	getProductDataById(params: getProInfoParams) {
		return get<baseRes<ProductData>>({
			url: `${urlFunc.requestHost()}/common/product/findById`,
			params
		})
	},
	// 新增产品基础数据
	addProductData(params: addProDataParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/create`,
			params
		})
	},
	// 编辑产品基础数据
	updateProductData(params: updateProDataParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/update`,
			params
		})
	},
	// 批量删除行业基础数据
	deleteProductDatas(params: deleteTradesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/delete`,
			params
		})
	},
	// 批量上架行业基础数据
	upProductDatas(params: deleteTradesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/up`,
			params
		})
	},
	// 批量下架行业基础数据
	downProductDatas(params: deleteTradesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/common/product/down`,
			params
		})
	},
	// 搜索框用户查询
	creators() {
		return get<baseRes<Creators[]>>({
			url: `${urlFunc.requestHost()}/admin/user/dropdownList`
		})
	}
}
