import { ReactText } from "react"
import { upFileItem } from "./api.interface"

export interface loginParams {
	username: string
	password: string
  code: string
  codeId: string
}
// 该用户下的展会
export interface getUserexhibitionParams {
	userId: number
}
// 字典列表
export interface getDicListParams {
	dictType: number
}
// 新增字典项
export interface addDicParams {
	id?: number
	dictTypeId?: number
	dictLabel?: string
	dictValue?: string
	sort?: number
	remark?: string
}
// 编辑字典项
export interface updateDicParams {
	id?: number
	dictTypeId?: number
	dictLabel?: string
	dictValue?: string
	sort?: number
	remark?: string
}
// 删除字典项
export interface delDicParams {}
export interface getDicItemParams {
	currentPage?: number
	pageSize?: number
	dictType?: string
	dictName?: string
}
export interface addDicItemParams {
	id?: number
	dictType?: string
	dictName?: string
	sort?: number
	remark?: string
}
export interface updateDicItemParams {
	id?: number
	dictType?: string
	dictName?: string
	sort?: number
	remark?: string
}
export interface delDicItemParams {
	// ids: any[]
}
export interface getRoleParams {
	currentPage?: number
	pageSize?: number
}
export interface getRoleInfoParams {
	id: string
}
export interface addRoleParams {
	id?: string
	name?: string
	remarks?: string
	sort?: number
	menuList?: any[]
}
export interface updateRoleParams {
	id?: string
	name?: string
	remarks?: string
	sort?: number
	menuList?: any[]
}
export interface delRoleParams {
	// ids: any[]
}
export interface userListParams {
	currentPage?: number
	pageSize?: number
	userName?: string
}
export interface getUserInfoParams {
	id: string
}
export interface addUserParams {
	id?: string
	username?: string
	password?: string
	realName?: string
	status?: number
	roleList?: any[]
}
export interface updateUserParams {
	id?: string
	username?: string
	password?: string
	realName?: string
	status?: number
	roleList?: any[]
}
export interface delUserParams {
	// ids: any[]
}
export interface getLogParams {
	currentPage?: number
	pageSize?: number
	key?: string
	operation?: string
	startTime?: string
	endTime?: string
	operationType?: number
}
export interface getExhibitionListData {
	currentPage?: number
	pageSize?: number
	title?: string
	state?: number
	webState?: number
	isDef?: number
}

export interface getExhibitionInfoParams {
	id: string
}
export interface addExhibitionParams {
	id?: string
	title?: string
	startTime?: string
	endTime?: string
	state?: number
	webState?: number
	isDef?: number
	contacts?: string
	address?: string
	remarks?: string
	isDel?: number
	listUserId?: any[]
	listIndustryId?: any[]
	listMenubarId?: any[]
	singFlag?: number
}
export interface updateExhibitionParams {
	id?: string
	title?: string
	startTime?: string
	endTime?: string
	state?: number
	webState?: number
	isDef?: number
	contacts?: string
	address?: string
	remarks?: string
	isDel?: number
	listUserId?: any[]
	listIndustryId?: any[]
	listMenubarId?: any[]
	singFlag?: number
}
export interface delExhibitionParams {}
export interface setDefShowParams {
	id: number
}
export interface getShowStatusParams {}
export interface showStatusData {
	notStarted: number
	inProcess: number
	finished: number
}
export interface getRegisteredListParams {
	currentPage?: number
	pageSize?: number
	mobile?: string
	name?: string
	company?: string
	source?: number
	province?: string
	city?: string
	area?: string
	startTime?: string
	endTime?: string
}
export interface getRegisteredInfoParams {
	id: string
}
// 行业分类单个查询
export interface getTradeParams {
	pid: number
}
// 行业分类树级查询
export interface getTradeTreeParams {}
// 新增行业分类
export interface addTradeClassParams {
	id?: string
	pid?: string
	title?: string
	sort?: number
	showType?: number
}
// 编辑行业分类
export interface updateTradeClassParams {
	id: number
	pid?: number
	title?: string
	sort?: number
	showType?: number
}
// 删除行业分类
export interface delTradeClassParams {
	// ids: any[]
}

export interface getProClassParams {
	pid: number
}
export interface getProTreeParams {}
export interface addProClassParams {
	id?: string
	pid?: string
	title?: string
	sort?: number
}
export interface updateProClassParams {
	id: number
	pid?: number
	title?: string
	sort?: number
}
export interface delProClassParams {
	// ids: any[]
}
export interface getTradeDataParams {
	currentPage?: number
	pageSize?: number
	key?: string
	industryId?: number
	solutionId?: number
	status?: number
	startTime?: string
	endTime?: string
}
export interface getTradeInfoParams {
	id: string
}
export interface addTradeDataParams {
	id?: number
	industryId?: number
	solutionId?: number
	title?: string
	image?: string
	introduction?: string
	content?: string
	products?: any[]
	dimensionalDrawing: any[]
	documents: any[]
	videos: any[]
	sort?: number
}
export interface updateTradeParams {
	id: string
	industryId?: string
	solutionId?: string
	title?: string
	content?: string
	products?: any[]
	image?: string
	introduction?: string
	dimensionalDrawing: any[]
	documents: any[]
	videos: any[]
	sort?: number
}
export interface deleteTradesParams {
	// ids: any[]
}
export interface getProDataParams {
	currentPage?: number
	pageSize?: number
	key?: string
	firstCategoryId?: number
	status?: number
	startTime?: string
	endTime?: string
}
export interface getProInfoParams {
	id: string
}
export interface addProDataParams {
	id?: number
	firstCategoryId?: number
	title?: string
	model?: string
	image?: string
	content?: string
	parameter?: string
	detailMaps?: any[]
	dimensionalDrawing?: any[]
	documents?: any[]
	videos?: any[]
	sort?: number
}
export interface updateProDataParams {
	id: string
	firstCategoryId?: number
	title?: string
	model?: string
	image?: string
	content?: string
	parameter?: string
	detailMaps?: any[]
	dimensionalDrawing?: any[]
	documents?: any[]
	videos?: any[]
	sort?: number
	industryId?: number
	solutionId?: number
}

export interface addExhibitionBannerParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	imageMobile: string
	type?: number
	url?: string
	sort?: number
}
export interface getExhibitionBannerListParams {
	id: number
	exhibitionId: string | string[]
	currentPage?: number
	pageSize?: number
	title?: string
}
export interface getOtherBannerParams {
	type: number
	exhibitionId: string | string[]
	currentPage?: number
	pageSize?: number
	title?: string
}
export interface updateExhibitionBannerParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	imageMobile: string
	type?: number
	url?: string
	sort?: number
}
export interface deleteExhibitionBannerParams {
	id: number
	exhibitionId: string | string[]
}
export interface addExhibitionNewsParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	publishTime: string
	introduction: string
	content?: string
	status: number
}
export interface getExhibitionNewsListParams {
	id: string
	exhibitionId: string | string[]
	title?: string
	currentPage?: number
	pageSize?: number
}
export interface updateExhibitionNewsParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	publishTime: string
	introduction: string
	content?: string
	status: number
}
export interface deleteExhibitionNewsParams {
	id: string
	exhibitionId: string | string[]
}

export interface addFlowpathParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	startTime: string
	endTime: string
	content?: string
}
export interface getFlowpathListParams {
	id: string
	exhibitionId: string | string[]
	startTime?: string
	endTime?: string
	currentPage?: number
	pageSize?: number
}
export interface updataFlowpathParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	startTime: string
	endTime: string
	content?: string
}
export interface deleteFlowpathParams {
	id: string
	exhibitionId: string | string[]
}

export interface addExhibitionPicParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	content?: string
	sort: number
}
export interface getExhibitionPicListParams {
	id: string
	exhibitionId: string | string[]
	title?: string
	currentPage?: number
	pageSize?: number
}
export interface updateExhibitionPicParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	content?: string
	sort: number
}
export interface deleteExhibitionPicParams {
	id: string
	exhibitionId: string | string[]
}

export interface addPartnerParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	sort: number
}
export interface getPartnerListParams {
	id: string
	exhibitionId: string | string[]
	title?: string
	currentPage?: number
	pageSize?: number
}
export interface updataPartnerParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	sort: number
}
export interface deletePartnerParams {
	id: string
	exhibitionId: string | string[]
}

export interface addHighlightParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	url: string
	sort: number
}
export interface getHighlightListParams {
	id: string
	exhibitionId: string | string[]
	title?: string
	currentPage?: number
	pageSize?: number
}
export interface updataHighlightParams {
	id: string
	exhibitionId: string | string[]
	title: string
	image: string
	url: string
	sort: number
}
export interface deleteHighlightParams {
	id: string
	exhibitionId: string | string[]
}

export interface addLiveStreamParams {
	id: string
	exhibitionId: string | string[]
	title: string
	urlPc: string
	urlMobile: string
}
export interface getLiveStreamListParams {
	id: string
	exhibitionId: string | string[]
	title?: string
	currentPage?: number
	pageSize?: number
}
export interface updataLiveStreamParams {
	id: string
	exhibitionId: string | string[]
	title: string
	roomId: string | number
}
export interface deleteLiveStreamParams {
	id: string
	exhibitionId: string | string[]
}
export interface getSiteMapListParams {
	id?: string
	exhibitionId: string | string[]
	title?: string
	currentPage?: number
	pageSize?: number
	state?: number
}
export interface updataSiteMapParams {
	id: string
	exhibitionId: string | string[]
	state: number
	title?: string
	sort?: number
}

export interface updateSiteMapListParams {
	listId: string[]
	state: number
	exhibitionId: string | string[]
}

export interface getExhibitioninfoParams {
	id: string
	exhibitionId: string | string[]
}
export interface updateExhibitioninfoParams {
	id: string
	exhibitionId: string | string[]
	startTime: string
	endTime: string
	title: string
	address: string
	remarks: string
}
export interface ExhibitionUpdateinfo {
	key: string
	alias: string
	value: string
}

export interface getExhibitionMenusParams {
	exhibitionId: string | string[]
}
export interface getSensitive {
	currentPage: number
	pageSize: number
	count: number
	entities: any[]
}
export interface getSensitiveById {
	id: number
}
export interface addSensitive {
	id: number
	typeId: number
	name: string
}
export interface getSensitiveClass {
	dictType: string
}
export interface delSensitive {}
export interface informationList {
	exhibitionId: string | string[]
	currentPage: number
	pageSize: number
	mobile: string
	name: string
	startTime: string
	endTime: string
}
export interface informationListName {}
export interface informationName {
	exhibitionId: string | string[]
	currentPage: number
	pageSize: number
	mobile: string
	name: string
	startTime: string
	endTime: string
}
export interface wxshare {
	id: number
	exhibitionId: string | string[]
	flag: string
	name?: string
	img: string
	title: string
	introduction: string
	isDefault: string
}
export interface wxshares {
	exhibitionId: string | string[]
}
export interface wxsharebyid {
	id: number
}
export interface yunshang {
	exhibitionId: string | string[]
}
export interface setyunshang {
	id?: number
	img?: string
	industryId?: any
	introduction?: string
	title?: string
	type?: number
	exhibitionId: string | string[]
}
export interface investDataParams {
	id?: number
	exhibitionId: string | string[]
}
export interface updateInvestDataParams {
	id?: number
	exhibitionId: string | string[]
	name: string
	list: investItem[]
}
export interface investItem {
	id?: number
	topic: string
	info?: string
	type: number
	isRequired: number
}
export interface investId {
	id: number
}
export interface infoId {
	infoId: number
}

export interface signItem {
	currentPage?: number
	pageSize?: number
	exhibitionId?: number
	accountId?: number
	keyWork?: string
	startTime: string
	endTime: string
}
export interface createInvitaionParams {
	name: string
	templateId: number
	pages: string
	info: string
}
export interface updateInvitaionParams {
	id: string
	info?: string
	name?: string
	pages?: string
}
export interface getregistrationListParams {
	currentPage?: number
	pageSize?: number
	invitationId?: string
	keyWord?: string
	startTime?: string
	endTime?: string
}

export interface getInvitationListParams {
	currentPage?: number
	pageSize?: number
	state?: number
	keyword?: string
}
export interface InvitaionUpdateParams {
	id: string
	wechatTitle?: string
	wechatContent?: string
	productCover?: string
}
export interface InvitaionCardUpdateParams {
	id: string
	name?: string
	templateId: number
	logoUrl?: string
	qrUrl?: string
	qrInfo?: string
	content?: string
}

// 抽奖
export interface getDrawListParams {
	currentPage?: number
	pageSize?: number
	state?: number
	name?: string
}

export interface changeDrawParams {
	id?: string
	name: string
	music: string
	awards: Award[]
}

export interface Award {
	name: string
	img: any
	num: number
	content: string
}

export interface getWinnersParams {
	currentPage?: number
	pageSize?: number
	activityId: string
	awardsName: string
	mobile: string
}
export interface updateHotBackParams {
	id: number
	backImg: string
	hex: string
	hexC: string
	isDefault: number
}
export interface updateMenuType {
	id?: number
	sort: number
	name: string
}
