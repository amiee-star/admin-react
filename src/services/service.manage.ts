import { get, postJson, post } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"
import {
	addExhibitionPicParams,
	getExhibitionPicListParams,
	updateExhibitionPicParams,
	deleteExhibitionPicParams,
	addExhibitionNewsParams,
	getExhibitionNewsListParams,
	updateExhibitionNewsParams,
	deleteExhibitionNewsParams,
	addFlowpathParams,
	getFlowpathListParams,
	updataFlowpathParams,
	deleteFlowpathParams,
	addExhibitionBannerParams,
	getExhibitionBannerListParams,
	updateExhibitionBannerParams,
	deleteExhibitionBannerParams,
	addPartnerParams,
	getPartnerListParams,
	updataPartnerParams,
	deletePartnerParams,
	addHighlightParams,
	getHighlightListParams,
	updataHighlightParams,
	deleteHighlightParams,
	addLiveStreamParams,
	getLiveStreamListParams,
	updataLiveStreamParams,
	getSiteMapListParams,
	updataSiteMapParams,
	updateSiteMapListParams,
	getExhibitioninfoParams,
	updateExhibitioninfoParams,
	getExhibitionMenusParams,
	wxshare,
	wxshares,
	wxsharebyid,
	yunshang,
	setyunshang,
	informationList,
	investDataParams,
	investId,
	infoId,
	getOtherBannerParams,
	createInvitaionParams,
	updateInvitaionParams,
	getregistrationListParams,
	signItem,
	getInvitationListParams,
	InvitaionCardUpdateParams,
	getDrawListParams,
	changeDrawParams,
	getWinnersParams,
	updateHotBackParams,
	updateMenuType,
	ExhibitionUpdateinfo
} from "@/interfaces/params.interface"
import {
	baseRes,
	PageData,
	ExhibitionPicListItem,
	ExhibitionNewsListItem,
	LiveStreamListItem,
	ExhibitioninfoItem,
	ExhibitionMenusItem,
	HighlightListItem,
	PartnerListItem,
	ExhibitionBannerListItem,
	FlowpathListItem,
	SiteMapListItem,
	investData,
	investItemData,
	sumInvestData,
	wendatiList,
	OtherBanner,
	invitationTemplateList,
	previewInvitaion,
	registrationItem,
	invitationTemplateItem,
	getSign,
	InvitationCardInfo,
	InvitationCardTemp,
	DrawInfo,
	Winners,
	SharesiteData,
	StartVideo,
	HotBack,
	MenuTypeItem,
	ExhibitionInfo
} from "@/interfaces/api.interface"
export default {
	//-----------展会管理相关接口-------------------

	//---展会图片部分
	addExhibitionPic(params: addExhibitionPicParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/image/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	getExhibitionPicList(params: getExhibitionPicListParams) {
		return get<baseRes<PageData<ExhibitionPicListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/image/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updateExhibitionPic(params: updateExhibitionPicParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/image/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	deleteExhibitionPic(params: deleteExhibitionPicParams) {
		console.log(params)
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/image/delete`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	//---展会新闻部分
	addExhibitionNews(params: addExhibitionNewsParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/news/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getExhibitionNewsList(params: getExhibitionNewsListParams) {
		return get<baseRes<PageData<ExhibitionNewsListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/news/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updateExhibitionNews(params: updateExhibitionNewsParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/news/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	deleteExhibitionNews(params: deleteExhibitionNewsParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/news/delete`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	//---展会流程部分
	addFlowpath(params: addFlowpathParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/process/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getFlowpathList(params: getFlowpathListParams) {
		return get<baseRes<PageData<FlowpathListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/process/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updataFlowpath(params: updataFlowpathParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/process/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	deleteFlowpath(params: deleteFlowpathParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/process/delete`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	//展会banner设置部分
	addExhibitionBanner(params: addExhibitionBannerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/banner/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getExhibitionBannerList(params: getExhibitionBannerListParams) {
		return get<baseRes<PageData<ExhibitionBannerListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/banner/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updateExhibitionBanner(params: updateExhibitionBannerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/banner/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	deleteExhibitionBanner(params: deleteExhibitionBannerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/banner/delete`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getOtherBanner(params: getOtherBannerParams) {
		return get<baseRes<OtherBanner[]>>({
			url: `${urlFunc.requestHost()}/exhibition/banner/listBannerByExhibitionId`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//展会合作媒体部分
	addPartner(params: addPartnerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/media/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getPartnerList(params: getPartnerListParams) {
		return get<baseRes<PageData<PartnerListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/media/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updataPartner(params: updataPartnerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/media/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	deletePartner(params: deletePartnerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/media/delete`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	//展会精彩片段部分
	addHighlight(params: addHighlightParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/video/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getHighlightList(params: getHighlightListParams) {
		return get<baseRes<PageData<HighlightListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/video/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updataHighlight(params: updataHighlightParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/video/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	deleteHighlight(params: deleteHighlightParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/video/delete`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//展会直播
	addLiveStream(params: addLiveStreamParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/live/create`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getLiveStreamList(params: getLiveStreamListParams) {
		return get<baseRes<PageData<LiveStreamListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/live/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updataLiveStream(params: updataLiveStreamParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/live/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//3D导览岛设置

	getSiteMapList(params: getSiteMapListParams) {
		return get<baseRes<PageData<SiteMapListItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/industry/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updataSiteMap(params: updataSiteMapParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/industry/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	updateSiteMapList(params: updateSiteMapListParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/industry/updateList`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//展会信息部分
	getExhibitioninfo(params: getExhibitioninfoParams) {
		return get<baseRes<PageData<ExhibitioninfoItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/info`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	updateExhibitioninfo(params: updateExhibitioninfoParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/update`,
			params
			// headers: {
			// 	exhibitionId: params.exhibitionId
			// }
		})
	},
	exhibitionUpdateinfo(params: ExhibitionUpdateinfo) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/updateInfo`,
			params
			// headers: {
			// 	exhibitionId: params.exhibitionId
			// }
		})
	},
	//根据展会id获取menu
	getExhibitionMenus(params: getExhibitionMenusParams) {
		return get<baseRes<ExhibitionMenusItem[]>>({
			url: `${urlFunc.requestHost()}/exhibition/menubar/listMenubar`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//查询微信分享
	getWxShare(params: wxshare) {
		return get<baseRes<ExhibitionMenusItem[]>>({
			url: `${urlFunc.requestHost()}/exhibition/share/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	getMoRenWxShare(params: wxshares) {
		return get<baseRes<ExhibitionMenusItem>>({
			url: `${urlFunc.requestHost()}/exhibition/share/findDefault`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	setMoRenWxShare(params: wxshare) {
		return postJson<baseRes<ExhibitionMenusItem[]>>({
			url: `${urlFunc.requestHost()}/exhibition/share/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	setMoRenWxShareById(params: wxsharebyid) {
		return get<baseRes<ExhibitionMenusItem>>({
			url: `${urlFunc.requestHost()}/exhibition/share/findById`,
			params
		})
	},
	//云上大华
	yxgetyunshang(params: yunshang) {
		return get<baseRes<ExhibitionMenusItem>>({
			url: `${urlFunc.requestHost()}/exhibition/cloud/info`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	yxsetyunshang(params: setyunshang) {
		return postJson<baseRes<ExhibitionMenusItem[]>>({
			url: `${urlFunc.requestHost()}/exhibition/cloud/update`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	yxgethangye(params: { exhibitionId: string | number }) {
		return get<baseRes<ExhibitionMenusItem[]>>({
			url: `${urlFunc.requestHost()}/exhibition/industry/listIndustryByExhibitionId`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	// 业务模块展会留言
	zhInformationList(params: informationList) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/admin/message/list`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//问卷调查
	getInvestigationInfo(params: investDataParams) {
		return get<baseRes<investItemData>>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/findExhibitionQuestionnaire`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//获取问卷详情
	getInvestigation(params: investDataParams) {
		return get<baseRes<investData>>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/questionnaireInfo`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//更新问卷
	updateInvestigation(params: investDataParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/updateQuestionnaireInfo`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},
	//上架问卷
	upInvestigation(params: investId) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/up`,
			params
		})
	},
	//下架问卷
	downInvestigation(params: investId) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/down`,
			params
		})
	},
	sumInvestigation(params: investDataParams) {
		return get<baseRes<sumInvestData>>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/statistical`,
			params,
			headers: {
				exhibitionId: params.exhibitionId
			}
		})
	},

	wendatiList(params: infoId) {
		return get<baseRes<PageData<wendatiList>>>({
			url: `${urlFunc.requestHost()}/exhibition/questionnaire/questionStatistical`,
			params
		})
	},

	getSign(params: signItem) {
		return get<baseRes<PageData<getSign>>>({
			url: `${urlFunc.requestHost()}/exhibition/sign/list`,
			params
		})
	},

	//查询邀请函模板
	getInvitationTemplates() {
		return get<baseRes<PageData<invitationTemplateList>>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/template`
		})
	},
	//新增邀请函
	createInvitaion(params: createInvitaionParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/create`,
			params
		})
	},
	//查询邀请函列表
	getInvitationList(params: getInvitationListParams) {
		return get<baseRes<PageData<invitationTemplateList>>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/list`,
			params
		})
	},
	//查询邀请函
	getInvitation(params: { id: string }) {
		return get<baseRes<invitationTemplateItem>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/findById`,
			params
		})
	},
	//修改邀请函
	updateInvitaion(params: updateInvitaionParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/update`,
			params
		})
	},
	//获取预览信息
	previewInvitaion(params: { id: string }) {
		return get<baseRes<previewInvitaion>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/preview`,
			params
		})
	},
	//分享邀请函
	shareInvitaion(params: { id: string }) {
		return get<baseRes<previewInvitaion>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/share`,
			params
		})
	},
	shareInvitaionUpdate(params: InvitaionUpdateParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/share/update`,
			params
		})
	},
	//发布邀请函
	publishInvitation(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/publish`,
			params
		})
	},
	//启用邀请函
	enableInvitation(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/enable`,
			params
		})
	},
	//禁用邀请函
	disableInvitation(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/disabled`,
			params
		})
	},
	//删除邀请函
	deleteInvitation(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/delete`,
			params
		})
	},
	//分页查询人员明细 --待完成
	registrationListInvitation(params: getregistrationListParams) {
		return get<baseRes<PageData<registrationItem>>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/registrationList`,
			params
		})
	},
	// 获取报名页字段
	registrationFieldsInvitation(params: { id: string }) {
		return get<baseRes<string>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/registrationFields`,
			params
		})
	},

	//获取邀请卡模板
	getInvitationCardTemp(params: { pageSize?: number; currentPage?: number }) {
		return get<baseRes<PageData<InvitationCardTemp>>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/cardTemplate`,
			params
		})
	},
	getInvitationCardInfo(params: { id: string }) {
		return get<baseRes<InvitationCardInfo>>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/cardFindById`,
			params
		})
	},
	updateInvitaionCardInfo(params: InvitaionCardUpdateParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/invitation/cardUpdate`,
			params
		})
	},
	filedownload(params: { url: string }) {
		return get<baseRes<string>>({
			url: `${urlFunc.requestHost()}/file/download`,
			params
		})
	},
	// 抽奖活动
	getDrawList(params: getDrawListParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/page`,
			params
		})
	},
	getDrawInfo(params: { id: string }) {
		return get<baseRes<DrawInfo>>({
			url: `${urlFunc.requestHost()}/exhibition/activity/info`,
			params
		})
	},
	addDrawActivity(params: changeDrawParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/create`,
			params
		})
	},
	uploadDrawActivity(params: changeDrawParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/update`,
			params
		})
	},
	enableDrawActivity(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/enable`,
			params
		})
	},
	disabledDrawActivity(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/disabled`,
			params
		})
	},
	deleteDrawActivity(params: { id: string }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/delete`,
			params
		})
	},
	searchInnerWinners(params: { id: string }) {
		return get<baseRes<Winners[]>>({
			url: `${urlFunc.requestHost()}/exhibition/activity/innerWinners`,
			params
		})
	},
	searchAwardsName(params: { id: string }) {
		return get<baseRes<{ id: string; name: string }[]>>({
			url: `${urlFunc.requestHost()}/exhibition/activity/findAwardsName`,
			params
		})
	},
	deleteWinners(params: { ids: React.ReactText[] }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/deleteWinners`,
			params: params.ids
		})
	},
	updateInnerWinners(params: { id: string; arr: any }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/updateInnerWinners?id=${params.id}`,
			params: params.arr
		})
	},
	getWinners(params: getWinnersParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/winnersPage`,
			params
		})
	},
	awardsCheck(params: { id: string; awardsId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/activity/awardsCheck`,
			params
		})
	},
	shareSite(params: { id: string }) {
		return get<baseRes<SharesiteData>>({
			url: `${urlFunc.requestHost()}/exhibition/industry/share`,
			params
		})
	},
	getStartVideo() {
		return get<baseRes<StartVideo>>({
			url: `${urlFunc.requestHost()}/exhibition/startVideo/find`
		})
	},
	saveStartVideo(params: { url: string; size: number }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/startVideo/save`,
			params
		})
	},
	getHotBack() {
		return get<baseRes<HotBack>>({
			url: `${urlFunc.requestHost()}/exhibition/industry/hotspot`
		})
	},
	updateHotBack(params: updateHotBackParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/industry/updateHotspot`,
			params
		})
	},
	getMenuType() {
		return get<baseRes<MenuTypeItem[]>>({
			url: `${urlFunc.requestHost()}/exhibition/industry/category`
		})
	},
	updateMenuType(params: updateMenuType) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/industry/updateCategory`,
			params
		})
	},
	addMenuType(params: updateMenuType) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/industry/addCategory`,
			params
		})
	},
	deleteMenuType(params: { id: number }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/exhibition/industry/deleteCategory`,
			params
		})
	},
	getExbitionInfo() {
		return get<baseRes<ExhibitionInfo[]>>({
			url: `${urlFunc.requestHost()}/exhibition/getInfo`
		})
	},
  // 重置密码
  resetpassword(params: { password: string, newPassword: string }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/admin/user/resetPassword`,
			params
		})
	},
}
