import { ColumnType } from "antd/es/table/interface"
import { Badge, Button, Image, message, Tooltip } from "antd"
import moment from "moment"
import React, { useCallback } from "react"
import copy from "copy-to-clipboard"
import { check } from "prettier"
import urlFunc from "@/utils/url.func"
import configUrl from "@/../config/proxy"
import Link from "@/lib/wangEditor/menus/link"
import { ModalCustom } from "@/components/modal/modal.context"
import AddInvitationmodal from "@/components/modal/manage/addInvitation.modal"
import JoinDetailInvitationModel from "@/components/modal/manage/joinDetailsInvitation.modal"
import InvitationTitleModal from "@/components/modal/manage/invitationtitle.modal"
const handleCopy = (e: string) => () => {
	copy(e)
	message.info("复制成功！")
}

const fn = (v: any) => {
	if (v) {
		return (
			<>
				<div>
					<Image style={{ maxWidth: "100px", cursor: "pointer" }} src={`${urlFunc.replaceUrl(v, "imageUrl")}`} alt="" />
				</div>
			</>
		)
	} else {
		return
	}
}
const invitationJoins = (id: string) => () => {
	ModalCustom({
		content: JoinDetailInvitationModel,
		params: { invitationId: id }
	})
}
const invitationupdates = (id: string) => () => {
	console.log("传入的ID:", id)
	ModalCustom({
		content: InvitationTitleModal,
		params: { id: id }
	})
}
const showNameDom = (v: any, item: any) => {
	const linkto = useCallback(
		url => () => {
			// console.log(url)
			window.open(url)
		},
		[]
	)
	return (
		<div
			style={{
				color: "#1890ff",
				cursor: "pointer"
			}}
			onClick={linkto(item.exhibitionLink)}
		>
			{v}
		</div>
	)
}

const trun = (v: any) => {
	if (v == 1) {
		console.log(v)
		return (
			<>
				<div>3D导览岛</div>
			</>
		)
	} else {
		return (
			<>
				<div>2.5D导览页</div>
			</>
		)
	}
}
const columnFields: Record<string, ColumnType<any>> = {
	demo: {
		title: "demo",
		dataIndex: "demo",
		key: "demo",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	// 序号
	sort: {
		title: "序号",
		dataIndex: "id",
		key: "id",
		width: 60,
		fixed: "left",
		align: "center",
		ellipsis: true,
		render: (v: any, item: any, index: number) => {
			return <>{index + 1}</>
		}
	},
	// 创建时间
	creator: {
		title: "创建人",
		dataIndex: "creator",
		key: "creator",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	createDate: {
		title: "创建时间",
		dataIndex: "createDate",
		key: "createDate",
		width: 120,
		align: "center",
		ellipsis: true,
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	createTime: {
		title: "创建时间",
		dataIndex: "createTime",
		key: "createTime",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	// 手机号
	mobile: {
		title: "手机号",
		dataIndex: "mobile",
		key: "mobile",
		width: 80,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	// 注册渠道
	source: {
		title: "注册渠道",
		dataIndex: "source",
		key: "source",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			if (value == 1) {
				return "pc"
			} else if (value == 2) {
				return "小程序"
			} else {
				return "h5"
			}
		}
	},
	// 单位
	company: {
		title: "单位名称",
		dataIndex: "company",
		key: "company",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			return <>{value}</>
		}
	},
	area: {
		title: "所在区域",
		dataIndex: "company",
		key: "company",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			if (!itemData.provinceName) {
				itemData.provinceName = ""
			}
			if (!itemData.cityName) {
				itemData.cityName = ""
			}
			if (!itemData.areaName) {
				itemData.areaName = ""
			}
			return <>{`${itemData.provinceName}>${itemData.cityName}>${itemData.areaName}`}</>
		}
	},
	// 字典类型
	dictionaryType: {
		title: "字典类型",
		dataIndex: "dictType",
		key: "dictType",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			return <>{value}</>
		}
	},
	// 字典名称
	dictionaryName: {
		title: "字典名称",
		dataIndex: "dictName",
		key: "dictName",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			return <>{value}</>
		}
	},
	// 账号名
	account: {
		title: "姓名",
		dataIndex: "realName",
		key: "realName",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			return <>{value}</>
		}
	},

	// 账户名
	userName: {
		title: "账号名",
		dataIndex: "userName",
		key: "userName",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			return <>{value}</>
		}
	},

	// IP
	IP: {
		title: "登录IP",
		dataIndex: "ip",
		key: "ip",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			return <>{value}</>
		}
	},
	// 系统日志登录时间
	time: {
		title: "登录时间",
		dataIndex: "time",
		key: "time",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	// 系统日志登录时间
	log: {
		title: "日志",
		dataIndex: "log",
		key: "log",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData, index) => {
			if (!!itemData.operation) {
				return <>{itemData.operation}</>
			} else {
				return ""
			}
		}
	},
	// 角色名称
	roleName: {
		title: "角色名称",
		dataIndex: "name",
		key: "name",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	// 备注
	remarks: {
		title: "备注",
		dataIndex: "remarks",
		key: "remarks",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	// 字典key
	dictionaryItemKey: {
		title: "字典key",
		dataIndex: "dictLabel",
		key: "dictLabel",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	// 字典value
	dictionaryItemValue: {
		title: "字典value",
		dataIndex: "dictValue",
		key: "dictValue",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	//备注
	dictionaryItemRemark: {
		title: "备注",
		dataIndex: "remark",
		key: "remark",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	//账号名
	username: {
		title: "账号名",
		dataIndex: "username",
		key: "username",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	//姓名
	realName: {
		title: "姓名",
		dataIndex: "realName",
		key: "realName",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	//权限集合
	roleList: {
		title: "权限集合",
		dataIndex: "roleList",
		key: "roleList",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData) => {
			const roleList: any[] = []
			if (itemData.roleList) {
				itemData.roleList.forEach((item: { name: any }) => {
					roleList.push(item.name)
				})
			}
			return `${roleList.join("/")}`
		}
	},
	// 展会
	hall: {
		title: "注册来源",
		dataIndex: "hallName",
		key: "hallName",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData) => {
			if (!!itemData.hallName) {
				return <>{value}</>
			}
		}
	},
	// 注册用户的姓名
	name: {
		title: "姓名",
		dataIndex: "name",
		key: "name",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: (value, itemData) => {
			if (!!itemData.name) {
				return <>{value}</>
			}
		}
	},
	// 注册时间
	registerDate: {
		title: "注册时间",
		dataIndex: "createDate",
		key: "createDate",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	// --------系统配置start

	// 菜单字段配置start
	ZmenuName: {
		title: "菜单名称",
		dataIndex: "menuName",
		key: "menuName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	ZmenuSort: {
		title: "序号",
		dataIndex: "sort",
		key: "sort",
		width: 40,
		align: "center",
		ellipsis: true
	},
	ZmenuLevel: {
		title: "级别",
		dataIndex: "level",
		key: "level",
		width: 80,
		align: "center",
		ellipsis: true
	},
	// 菜单字段配置end

	// 展会管理start

	// 展会管理end
	// --------系统配置end

	// --------分类设置start
	//tradeName
	title: {
		title: "分类名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	showName: {
		title: "展会名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (v, itemData) => {
			return showNameDom(v, itemData)
		}
	},
	showTime: {
		title: "展会时间",
		dataIndex: "showTime",
		key: "showTime",
		width: 200,
		align: "center",
		ellipsis: true,
		render: (value, itemData, index) => {
			return (
				<>{`${moment(itemData.startTime).format("YYYY年MM月DD日")}~${moment(itemData.endTime).format(
					"YYYY年MM月DD日"
				)}`}</>
			)
		}
	},
	showTrade: {
		title: "展会行业",
		dataIndex: "showTrade",
		key: "showTrade",
		width: 200,
		align: "center",
		ellipsis: true,
		render: (value, itemData) => {
			const Industrys: any[] = []
			itemData.listIndustry.forEach((item: any) => {
				Industrys.push(item.title)
			})
			return Industrys.join(",")
		}
	},
	showStatus: {
		title: "展会状态",
		dataIndex: "state",
		key: "state",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => (value == 0 ? "未开始" : value == 1 ? "进行中" : "已结束")
	},
	webState: {
		title: "网页状态",
		dataIndex: "webState",
		key: "webState",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => (value == 0 ? "下架" : "上架")
	},
	isDefaultShow: {
		title: "是否为默认展会",
		dataIndex: "isDef",
		key: "isDef",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => (value == 0 ? "否" : "是")
	},
	//
	// -----展会相关字段配置start
	// 合作媒体
	mediaName: {
		title: "媒体名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	mediaLogo: {
		title: "媒体Logo",
		dataIndex: "image",
		key: "image",
		width: 80,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return fn(v)
		}
	},
	mediaSort: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 80,
		align: "center",
		ellipsis: true
	},
	creatorName: {
		title: "创建人",
		dataIndex: "creatorName",
		key: "creatorName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	//展会流程

	serialNumber: {
		title: "序号",
		dataIndex: "id",
		key: "id",
		width: 30,
		align: "center",
		ellipsis: true
	},
	// --------分类设置start
	//tradeName
	tradeName: {
		title: "分类名称",
		dataIndex: "tradeName",
		key: "tradeName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	propositionDate: {
		title: "日期",
		dataIndex: "startTime",
		key: "startTime",
		width: 80,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			value = moment(new Date(value)).format("YYYY年MM月DD日")
			return <>{value.substring(0, 12)}</>
		}
	},
	timeQuantum: {
		title: "时间",
		dataIndex: "time",
		key: "time",
		width: 80,
		align: "center",
		ellipsis: {
			showTitle: false
		}
	},
	proposition: {
		title: "议题",
		dataIndex: "content",
		key: "content",
		width: 100,
		align: "center",
		ellipsis: true
	},
	//Banner设置

	setBannerCover: {
		title: "封面",
		dataIndex: "image",
		key: "image",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return fn(v)
		}
	},
	setBannerName: {
		title: "名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	setBannerLink: {
		title: "跳转链接",
		dataIndex: "url",
		key: "url",
		width: 150,
		align: "center",
		ellipsis: true
	},
	setBannerSort: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 30,
		align: "center",
		ellipsis: true
	},
	// 3D导览岛设置

	siteMapSort: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 30,
		align: "center",
		ellipsis: true
	},
	industry: {
		title: "行业",
		dataIndex: "industryName",
		key: "industryName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	displayStatus: {
		title: "显示状态",
		dataIndex: "state",
		key: "state",
		width: 80,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return <>{v === 0 ? "关闭" : "开启"}</>
		}
	},
	hotspotName: {
		title: "热点名称",
		dataIndex: "title",
		key: "title",
		width: 200,
		align: "center",
		ellipsis: true
	},
	//精彩片段
	videoName: {
		title: "视频名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	videoCover: {
		title: "视频封面",
		dataIndex: "image",
		key: "image",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return fn(v)
		}
	},
	videoSort: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 80,
		align: "center",
		ellipsis: true
	},
	modifier: {
		title: "修改人",
		dataIndex: "updaterName",
		key: "updaterName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	modificationTime: {
		title: "修改时间",
		dataIndex: "updateDate",
		key: "updateDate",
		width: 80,
		align: "center",
		ellipsis: true
	},
	// 展会图片
	PhotoName: {
		title: "图片名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	exhibitionPhoto: {
		title: "照片",
		dataIndex: "image",
		key: "image",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return fn(v)
		}
	},
	exhibitionSort: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 30,
		align: "center",
		ellipsis: true
	},
	exhibitionMsg: {
		title: "描述",
		dataIndex: "content",
		key: "content",
		width: 150,
		align: "center",
		ellipsis: true
	},
	// 展会新闻
	infoTitle: {
		title: "资讯标题",
		dataIndex: "title",
		key: "title",
		width: 150,
		align: "center",
		ellipsis: true
	},
	infoPhoto: {
		title: "图片",
		dataIndex: "image",
		key: "image",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return fn(v)
		}
	},
	infoTime: {
		title: "资讯时间",
		dataIndex: "publishTime",
		key: "publishTime",
		width: 150,
		align: "center",
		ellipsis: true
	},

	// -----展会相关字段配置end
	//直播管理
	liveTitle: {
		title: "直播标题",
		dataIndex: "title",
		key: "title",
		width: 150,
		align: "center",
		ellipsis: true
	},
	liveRoom: {
		title: "直播ID",
		dataIndex: "roomId",
		key: "roomId",
		width: 150,
		align: "center",
		ellipsis: true
	},

	// -----基础数据板块相关字段
	productName: {
		title: "产品名称",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	productModel: {
		title: "订货型号",
		dataIndex: "model",
		key: "model",
		width: 80,
		align: "center",
		ellipsis: true
	},
	productType: {
		title: "产品分类",
		dataIndex: "firstCategoryName",
		key: "firstCategoryName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	dataStatus: {
		title: "产品状态",
		dataIndex: "status",
		key: "status",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => {
			if (value == -1) {
				return <>{"待上架"}</>
			} else if (value == 0) {
				return <>{"已下架"}</>
			} else {
				return <>{"已上架"}</>
			}
		}
	},
	productCount: {
		title: "关联产品数",
		dataIndex: "productCount",
		key: "productCount",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => {
			return value
		}
	},
	oneType: {
		title: "一级分类行业",
		dataIndex: "industryName",
		key: "industryName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	twoType: {
		title: "二级分类行业应用场景/解决方案",
		dataIndex: "solutionName",
		key: "solutionName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	schemeName: {
		title: "方案/技术应用名",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	//敏感词
	sensitiveType: {
		title: "分类",
		dataIndex: "typeName",
		key: "typeName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	sensitiveName: {
		title: "名称",
		dataIndex: "name",
		key: "name",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	sensitiveCreator: {
		title: "创建人",
		dataIndex: "creatorName",
		key: "creatorName",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	sensitiveTime: {
		title: "创建时间",
		dataIndex: "createDate",
		key: "createDate",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (value: any, itemData: any, index: any) => {
			return <>{value}</>
		}
	},
	//留言记录
	information: {
		title: "展会",
		dataIndex: "exhibitionName",
		key: "exhibitionName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	informationContent: {
		title: "留言内容",
		dataIndex: "content",
		key: "informationContent",
		width: 80,
		align: "center",
		ellipsis: true
	},
	informationName: {
		title: "留言人",
		dataIndex: "name",
		key: "informationName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	informationTel: {
		title: "手机号",
		dataIndex: "mobile",
		key: "informationTel",
		width: 80,
		align: "center",
		ellipsis: true
	},
	informationTime: {
		title: "留言时间",
		dataIndex: "time",
		key: "informationTime",
		width: 80,
		align: "center",
		ellipsis: true
	},
	//微信分享
	wxpage: {
		title: "页面",
		dataIndex: "name",
		key: "informationTime",
		width: 80,
		align: "center",
		ellipsis: true
	},
	wxtype: {
		title: "配置方式",
		dataIndex: "isDefault",
		key: "wxtype",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (value: any, itemData: any, index: any) => {
			if (value == 1) {
				return <>默认配置</>
			} else {
				return <>自定义配置</>
			}
		}
	},
	wxtitle: {
		title: "微信分享标题",
		dataIndex: "title",
		key: "wxtitle",
		width: 80,
		align: "center",
		ellipsis: true
	},
	wxcontent: {
		title: "微信分享描述",
		dataIndex: "introduction",
		key: "wxcontent",
		width: 80,
		align: "center",
		ellipsis: true
	},
	wximage: {
		title: "微信分享图片",
		dataIndex: "img",
		key: "image",
		width: 80,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return fn(v)
		}
	},
	//云上大华
	ylanmu: {
		title: "栏目",
		dataIndex: "title",
		key: "title",
		width: 80,
		align: "center",
		ellipsis: true
	},
	yjump: {
		title: "调转链接指向",
		dataIndex: "type",
		key: "yjump",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return trun(v)
		}
	},
	// 问卷调查
	investname: {
		title: "问卷名称",
		dataIndex: "name",
		key: "name",
		width: 80,
		align: "center",
		ellipsis: true
	},

	investstatus: {
		title: "状态",
		dataIndex: "status",
		key: "status",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return v === -1 ? "待上架" : v === 0 ? "下架" : v === 1 ? "上架" : ""
		}
	},

	joinnumber: {
		title: "参与人数",
		dataIndex: "joinNum",
		key: "joinNum",
		width: 80,
		align: "center",
		ellipsis: true
	},

	investcreator: {
		title: "创建人",
		dataIndex: "creatorName",
		key: "creatorName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	investtime: {
		title: "创建时间",
		dataIndex: "createDate",
		key: "createDate",
		width: 80,
		align: "center",
		ellipsis: true
	},

	exitbitionname: {
		title: "展会名称",
		dataIndex: "exhibitionName",
		key: "exhibitionName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	investnumber: {
		title: "参与人数",
		dataIndex: "joinNum",
		key: "joinNum",
		width: 80,
		align: "center",
		ellipsis: true
	},

	// 签到功能
	exitbitions: {
		title: "展会",
		dataIndex: "exhibitionName",
		key: "exhibitionName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	accountName: {
		title: "姓名",
		dataIndex: "accountName",
		key: "accountName",
		width: 40,
		align: "center",
		ellipsis: true
	},
	signTime: {
		title: "签到时间",
		dataIndex: "time",
		key: "time",
		width: 90,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: value => {
			return <>{value}</>
		}
	},
	location: {
		title: "位置",
		dataIndex: "address",
		key: "address",
		width: 150,
		align: "center",
		ellipsis: true
	},
	locationName: {
		title: "地点",
		dataIndex: "locationName",
		key: "locationName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	//邀请函

	invitationName: {
		title: "邀请函名称",
		dataIndex: "name",
		key: "name",
		width: 120,
		align: "center",
		ellipsis: true,
		render: (value, item, index) => {
			return (
				<Button size="small" onClick={invitationupdates(item.id)}>
					{value}
				</Button>
			)
		}
	},

	templateName: {
		title: "模板名称",
		dataIndex: "templateName",
		key: "templateName",
		width: 120,
		align: "center",
		ellipsis: true
	},
	templateState: {
		title: "模板状态",
		dataIndex: "state",
		key: "state",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => {
			return ["待发布", "已发布", "禁用"][value]
		}
	},
	joinNum: {
		title: "参与人数",
		dataIndex: "joinNum",
		key: "joinNum",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (value, item, index) => {
			if (value == 0) {
				return value
			} else {
				return (
					<Button size="small" onClick={invitationJoins(item.id)}>
						{value}
						{/* {item.} */}
					</Button>
				)
			}
		}
	},

	drawName: {
		title: "抽奖活动名称",
		dataIndex: "name",
		key: "name",
		width: 120,
		align: "center",
		ellipsis: true
	},
	drawState: {
		title: "活动状态",
		dataIndex: "state",
		key: "state",
		width: 80,
		align: "center",
		ellipsis: true,
		render: value => {
			return ["禁用", "启用"][value]
		}
	},
	productShowType: {
		title: "显示类型",
		dataIndex: "showType",
		key: "showType",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return v === 1 ? "行业" : v === 2 ? "产品" : ""
		}
	},
	awardsName: {
		title: "奖项名称",
		dataIndex: "awardsName",
		key: "awardsName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	menuName: {
		title: "栏目",
		dataIndex: "name",
		key: "name",
		width: 80,
		align: "center",
		ellipsis: true
	},
	MenuTypeName: {
		title: "目录大类",
		dataIndex: "name",
		key: "name",
		width: 80,
		align: "center",
		ellipsis: true
	},
	MenuTypeSort: {
		title: "目录排序",
		dataIndex: "sort",
		key: "sort",
		width: 80,
		align: "center",
		ellipsis: true
	},
	videoSize: {
		title: "文件大小",
		dataIndex: "size",
		key: "size",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return v ? `${(v / 1024 / 1024).toFixed()}M` : 0
		}
	}
}
export default columnFields
export function returnColumnFields(keys: string[]) {
	// const columnKey = new Set(["id"].concat(keys))
	return keys.map(key => {
		if (!columnFields[key]) {
			throw new Error(`无${key}字段配置`)
		}
		return columnFields[key]
	})
}
