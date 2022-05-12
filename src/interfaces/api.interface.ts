// 接口返回需要的基础字段
export interface baseRes<D = {}> {
	success: boolean
	code: number
	message: string
	msg: string
	data: D //返回的数据字段
}
export interface PageParams {
	pageNum?: number
	pageSize?: number
}
export interface PageData<D = {}> {
	endTime: any
	startTime: any
	entities: D[]
	currentPage: number
	pageSize: number
	totalPage: number
	count: number
	list: D[]
}

export interface upFileItem {
	filePreviewUrl: string
	fileSaveUrl: string
	fileSize: number
}

export interface rolesPermissionsItem {
	id: number
	permissionName: string
	description: string
	createTs: string
}
export interface Authority {
	// id: number
	// parentId: number
	// action: string
	// icon: string
	// name: string
	// url?: string
	// sort: number
}
export interface userData {
	adminType: number
	createDate: string
	creatorName: string
	id: number
	loginDate: string
	menuList: []
	realName: string
	roleList: []
	status: number
	updateDate: string
	updaterName: string
	username: string
}

export interface UserRole {
	roleId: number
	roleName: string
}

export interface comboItem {
	id: number
	name: string
	code: string
}
export interface rolesListItem {
	id: string
	code: string
	name: string
}
// 菜单树接口返回
export interface menuTreeItem {
	children: menuTreeItem[]
	enabled: boolean
	hasPermission: boolean
	icon: string
	id: number
	leaf: boolean
	level: number
	menuName: string
	menuPath: string
	parentId: number
	sort: number
	title?: string
	type: number
	url: string
	key: number
}
// 菜单列表单个数据
export interface menusInfoData {
	id: number
	parentId: number
	menuName: string
	menuPath: string
	url: string
	icon: null
	sort: number
	level: number
	leaf: boolean
	type: number
	description: string
	children: menusInfoData[]
}

export interface UserexhibitionData {
	id: number
	exhibitionId: number
	userId: number
	creator: number
	createDate: number
}
export interface dicListData {
	id: number
	dictTypeId: number
	dictLabel: string
	dictValue: string
	sort: number
	remark: string
}
export interface dicItemData {
	id: number
	dictType: string
	dictName: string
	sort: number
	remark: string
}
export interface roleData {
	id: number
	name: string
	remarks: string
	sort: number
	menuList: any[]
}
export interface RoleInfoData {
	id: number
	name: string
	remarks: string
	sort: number
	menuList: any[]
}
export interface userListData {
	id: number
	username: string
	realName: string
	adminType: number
	status: number
	createDate: string
	updateDate: string
	creatorName: string
	updaterName: string
	loginDate: string
	roleList: any[]
	menuList: any[]
}
export interface userInfoData {
	password: any
	id: number
	username: string
	realName: string
	adminType: number
	status: number
	createDate: string
	updateDate: string
	creatorName: string
	updaterName: string
	loginDate: string
	roleList: any[]
	menuList: any[]
}
export interface getLogData {
	userName: string
	realName: string
	ip: string
	time: string
	operationType: number
	operation: string
}
export interface ExhibitionListData {
	id: number
	title: string
	startTime: string
	endTime: string
	state: number
	webState: number
	isDef: number
	address: string
	remarks: string
	creator: number
	creatorName: string
	createDate: string
	updater: number
	updaterName: string
	updateDate: string
	isDel: number
	exhibitionLink: string
	listAdmin: any[]
	listIndustry: any[]
	listExhibitionIndustry: any[]
	listMenubar: any[]
	appletUrl: string
	listSign: Sign[]
}
export interface Sign {
	id?: number
	locationName: string
	address: string
	longitude: string
	latitude: string
	scope: string
}

export interface registeredListData {
	id: number
	name: string
	hallId: number
	hallName: string
	email: string
	mobile: string
	company: string
	province: string
	provinceName: string
	city: string
	cityName: string
	area: string
	areaName: string
	source: number
	headimgurl: string
	createDate: string
	updateDate: string
}
export interface TradeClassList {
	id: number
	pid: number
	sort: number
	title: string
	children: any
}
export interface proClassData {
	id: number
	pid: number
	title: string
	sort: number
	children: any
}
//展会管理菜单
// export interface ExhibitionMenusItem {
// 	img: any
// 	id: number
// 	exhibitionId: number
// 	menubarId: number
// 	title: string
// 	link: string
// 	url: string
// }

export interface TradeData {
	id: number
	industryId: number
	industryName: null
	solutionId: number
	solutionName: null
	title: string
	image: string
	introduction: string
	content: string
	products: ProductItem[]
	videos?: []
	dimensionalDrawing?: []
	documents?: []
}
export interface ProductData {
	content: string
	createDate: string
	creatorName: []
	detailMaps: []
	dimensionalDrawing: []
	documents: []
	firstCategoryId: number
	firstCategoryName: string
	id: number
	image: string
	model: string
	order: any
	parameter: string
	status: number
	title: string
	videos: []
	industryId: number
}
export interface ProductItem {
	id: number
	solutionId: number
	productId: number
	title: string
	model: string
	image: string
}

export interface ExhibitionPicListItem {
	content: string
	createDate: string
	creator: number
	creatorName: string
	exhibitionId: number
	id: number
	image: string
	sort: number
	title: string
	updateDate: string
	updater: number
	updaterName: string
}

export interface ExhibitionNewsListItem {
	content: string
	createDate: string
	creatorName: string
	exhibitionId: 3
	id: number
	image: string
	introduction: string
	publishTime: string
	sort: number
	status: number
	title: string
}

export interface FlowpathListItem {
	content: string
	createDate: string
	creatorName: string
	endTime: string
	exhibitionId: number
	id: number
	image: string
	startTime: string
}

export interface ExhibitionBannerListItem {
	exhibitionId: number
	id: number
	image: string
	tinyImage: string
	imageMobile: string
	sort: number
	title: string
	url: string
}
export interface OtherBanner {
	id: number
	exhibitionId: number
	title: string
	image: string
	imageMobile: string
	url: string
	sort: number
	creator: number
	creatorName: string
	createDate: number
	updater: number
	updaterName: string
	updateDate: number
}

export interface PartnerListItem {
	createDate: string
	creatorName: string
	exhibitionId: number
	id: number
	image: string
	sort: number
	title: string
}

export interface HighlightListItem {
	exhibitionId: number
	id: number
	image: string
	sort: number
	title: string
	updateDate: string
	updater: number
	updaterName: string
	url: string
}
export interface LiveStreamListItem {
	exhibitionId: number
	id: number
	title: string
	urlMobile: string
	urlPc: string
}
export interface ExhibitioninfoItem {
	id: number
	address: string
	endTime: string
	remarks: string
	startTime: string
	title: string
}

export interface ExhibitionMenusItem {
	createDate: string
	exhibitionId: number
	id: number
	isDel: number
	link: string
	menubarId: number
	title: string
	updateDate: string
	url: string
	state: number
	img?: any
	type?: number
	flag?: string
	isDefault?: number
}

export interface SiteMapListItem {
	exhibitionId: number
	id: number
	industryId: number
	industryName: string
	sort: number
	state: number
	title: string
	categoryId: number
}
//问卷调查
export interface investItemData {
	id: number
	exhibitionId: number
	exhibitionName: null | string
	name: string
	status: number
	joinNum: number
	creatorName: string
	createDate: string
	list: null | any[]
}

export interface investData {
	id: number
	exhibitionId: number
	exhibitionName: null | string
	name: string
	status: number
	joinNum: number
	creatorName: null | string
	createDate: string
	list: investListItem[]
}

export interface investListItem {
	id: number
	topic: string
	info: string
	details: null | string
	type: number
	isRequired: number
	remark: string | null | boolean
}
export interface sumInvestData {
	id: number
	name: string
	joinNum: number
	list: sumInvest[]
}

export interface sumInvest {
	id: number
	topic: string
	info: string
	type: number
	isRequired: number
	list: sumInvestList[]
}

export interface sumInvestList {
	choice: string
	content: string
	num: number
	proportion: string
}

export interface wendatiList {
	id: number
	accountId: number
	name: string
	mobile: string
	details: string
	time: string
}
export interface getSign {
	accountId: number
	accountName: string
	address: string
	exhibitionName: string
	id: number
	latitude: string
	locationName: string
	longitude: string
	mobile: string
	signId: number
	time: string
}
export interface invitationTemplateList {
	id: number
	name: string
	pageInfo: string
}
export interface invitationTemplateItem {
	id: string
	name: string
	templateName: string
	templateId: number
	pages: string
	state: number
	joinNum: number
	info: string
	creatorName: string
	createDate: string
}
export interface invitationTemplates {
	id: number
	name: string
	pageInfo: Pages[]
}

export interface Pages {
	img: string
	name: string
	type: string
}
export interface previewInvitaion {
	url: string
	qrCode: string
	wechatTitle: string
	wechatContent: string
	productCover: string
}
export interface registrationItem {
	id: number
	invitationId: string
	registrationTime: string
	info: string
}

export interface InvitationCardInfo {
	id: string
	name: string
	backUrl: string
	logoUrl: string
	qrUrl: string
	qrInfo: string
	content: string
	style: string
}
export interface InvitationCardTemp {
	id: string
	name: string
	url: string
}

export interface DrawInfo {
	id: string
	exhibitionId: number
	state: number
	name: string
	music: string
	awards: Award[]
	url: string
	creatorName: null
	createDate: string
}

export interface Award {
	name: string
	img: any
	num: number
	content: string
}

export interface Winners {
	awardsName: string
	accountName: string
	mobile: string
}
export interface Creators {
	id: number
	name: string
}
export interface SharesiteData {
	id: number
	industryName: string
	qrUrl: string
	shareUrl: string
}
export interface StartVideo {
	name: string
	url: string
	size: string
}
export interface HotBack {
	id: number
	backImg: string
	hex: string
	hexC: string
	isDefault: number
}
export interface MenuTypeItem {
	id: number
	name: string
	sort: number
}
export interface ExhibitionInfo {
	key: string
	alias: string
	value: string
}
