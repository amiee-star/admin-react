import { investListItem } from "@/interfaces/api.interface"
import serviceManage from "@/services/service.manage"
import "./addInvestigation.model.less"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Space, Row, Col, Switch, message, Select, Radio } from "antd"
import { useForm } from "antd/lib/form/Form"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import SortItem from "@/components/utils/sort.item"
import eventBus from "@/utils/event.bus"
import { Tabs } from "antd"
import Cover from "@/components/invitmodule/cover"
import Introduction from "@/components/invitmodule/introduction"
import Agenda from "@/components/invitmodule/agenda"
import Display from "@/components/invitmodule/display"
import Activity from "@/components/invitmodule/activity"
import Exhibition from "@/components/invitmodule/exhibition"
import Booth from "@/components/invitmodule/booth"
import DyForms from "@/components/dyforms/dyforms.context"
import Code from "@/components/invitmodule/code"
import Global from "@/components/invitmodule/global"
import Introduction1 from "@/components/invitmodule/introduction1"
import Guests1 from "@/components/invitmodule/guests1"
import Highlights1 from "@/components/invitmodule/highlights1"
import Agenda1 from "@/components/invitmodule/agenda1"
import Guide1 from "@/components/invitmodule/guide1"
import Cover2 from "@/components/invitmodule/cover2"

const { TabPane } = Tabs
const { Option } = Select
interface Props {
	id: string
	copy: boolean
}

interface Panes {
	title: string
	content: JSX.Element
	key: string
	closable?: boolean
}
var loacObj = {
	address: "",
	longitude: "",
	latitude: ""
}

const ContentEditModal: React.FC<Props & ModalRef> = props => {
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const { modalRef, id, copy = false } = props
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const dyFormsRef = useRef<any>()
	const [form] = useForm()
	const [pageList, setPageList] = useState<string[]>([])
	const [panesList, setPanesList] = useState<Panes[]>()
	const [templateId, setTemplateId] = useState<number>()
	const [invitName, setInvitName] = useState<string>()
	const [loc, setloc] = useState<{ longitude: string; latitude: string }>()
	const [done, setDone] = useState(false)
	const [dyFormsData, setDyFormsData] = useState([])
	const [introductiondetail, setIntroductiondetail] = useState<string>("")

	const initialPanes = [
		{ title: "全局配置", content: <Global />, key: "global", closable: false },
		{ title: "封面页", content: <Cover />, key: "cover" },
		{ title: "介绍页", content: <Introduction introductionDetail={introductiondetail} />, key: "introduction" },
		{ title: "议程页", content: <Agenda />, key: "agenda" },
		{ title: "展示内容", content: <Display />, key: "display" },
		{ title: "活动信息", content: <Activity loc={loc} />, key: "activity" },
		{ title: "展馆导示", content: <Exhibition />, key: "exhibition" },
		{ title: "展位导示", content: <Booth />, key: "booth" },
		//第二套模板
		{ title: "活动简介", content: <Introduction1 />, key: "introduction1" },
		{ title: "活动嘉宾", content: <Guests1 />, key: "guests1" },
		{ title: "活动亮点", content: <Highlights1 />, key: "highlights1" },
		{ title: "活动议程", content: <Agenda1 />, key: "agenda1" },
		{ title: "活动导览", content: <Guide1 />, key: "guide1" },
		//第三套模板
		{ title: "全局配置", content: <Global />, key: "global2", closable: false },
		{ title: "封面页", content: <Cover2 />, key: "cover2" },
		{ title: "介绍页", content: <Introduction introductionDetail={introductiondetail} />, key: "introduction2" },
		{ title: "议程页", content: <Agenda />, key: "agenda2" },
		{ title: "展示内容", content: <Display />, key: "display2" },
		{ title: "活动信息", content: <Activity loc={loc} />, key: "activity2" },
		{ title: "展馆导示", content: <Exhibition />, key: "exhibition2" },
		{ title: "展位导示", content: <Booth />, key: "booth2" },

		//公共模板
		{ title: "报名页", content: <DyForms cRef={dyFormsRef} defaultContent={dyFormsData} />, key: "registration" },
		{ title: "二维码页", content: <Code />, key: "code" }
	]

	let mark = true

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		withParams.current = params
	}, [params])
	const formatdata = (url: any) => {
		if (url instanceof Array) {
			const arr: any = []
			url.forEach(item => {
				let obj = {
					postionId: item.postionId,
					url: [{ filePreviewUrl: item.url, fileSaveUrl: item.url, fileSize: 0 }]
				}
				arr.push(obj)
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: url,
					fileSaveUrl: url,
					fileSize: 0
				}
			]
		}
	}
	const formatImgList = (imgList: any, type: string) => {
		if (imgList instanceof Array) {
			const arr: any = []
			imgList.forEach(item => {
				if (type == "guests") {
					let obj = {
						title: item.title ? item.title : "",
						content: item.content ? item.content : "",
						img: [{ filePreviewUrl: item.img, fileSaveUrl: item.img, fileSize: 0 }]
					}
					arr.push(obj)
				} else if (type == "guide") {
					let obj = {
						content: item.content ? item.content : "",
						url: [{ filePreviewUrl: item.url, fileSaveUrl: item.url, fileSize: 0 }]
					}
					arr.push(obj)
				}
			})
			return arr
		}
	}
	const formatFile = (url: any) => {
		if (url instanceof Array) {
			const arr: imgsFace[] = []
			url.forEach(item => {
				let obj = {
					filePreviewUrl: item,
					fileSaveUrl: item,
					fileSize: 0
				}
				arr.push(obj)
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: url,
					fileSaveUrl: url,
					fileSize: 0
				}
			]
		}
	}

	const formatImg = (img: string) => {
		return [
			{
				filePreviewUrl: img,
				fileSaveUrl: img,
				fileSize: 0
			}
		]
	}

	const onFinish = useCallback(
		data => {
			const Arr = []
			if (pageList.includes("global")) {
				let obj = {
					type: "global",
					data: {
						labelPic: data.labelPic && data.labelPic.length > 0 ? data.labelPic[0].fileSaveUrl : ""
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("cover")) {
				let obj = {
					type: "cover",
					data: {
						coverName: data.coverName || form.getFieldValue("coverName") || "",
						coverAudio:
							(data.coverAudio && data.coverAudio.length > 0 && data.coverAudio[0].fileSaveUrl) ||
							(form.getFieldValue("coverAudio") &&
								form.getFieldValue("coverAudio").length > 0 &&
								form.getFieldValue("coverAudio")[0].fileSaveUrl) ||
							"",
						coverLogo:
							(data.coverLogo && data.coverLogo.length > 0 && data.coverLogo[0].fileSaveUrl) ||
							(form.getFieldValue("coverLogo") &&
								form.getFieldValue("coverAudio").length > 0 &&
								form.getFieldValue("coverLogo")[0].fileSaveUrl) ||
							""
					}
				}
				Arr.push(obj)
			}

			if (pageList.includes("introduction")) {
				let obj = {
					type: "introduction",
					data: {
						introductionTitle: data.introductionTitle || form.getFieldValue("introductionTitle") || "",
						introductionDetail: data.introductionDetail || form.getFieldValue("introductionDetail") || "",
						introductionSign: data.introductionSign || form.getFieldValue("introductionSign") || "",
						introductionDate: data.introductionDate || form.getFieldValue("introductionDate") || ""
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("agenda")) {
				let obj = {
					type: "agenda",
					data: {
						agenda: data.agenda || form.getFieldValue("agenda") || []
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("display")) {
				let obj = {
					type: "display",
					data: {
						display: data.display || form.getFieldValue("display") || []
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("activity")) {
				let obj = {
					type: "activity",
					data: {
						activityAddress: data.activityAddress || form.getFieldValue("activityAddress") || "",
						activityTime: data.activityTime || form.getFieldValue("activityTime") || "",
						activityTitle: data.activityTitle || form.getFieldValue("activityTitle") || "",
						longitude: loacObj.longitude || "",
						latitude: loacObj.latitude || ""
					}
				}

				Arr.push(obj)
			}
			if (pageList.includes("exhibition")) {
				let obj = {
					type: "exhibition",
					data: {
						exhibitionImg:
							(data.exhibitionImg && data.exhibitionImg.map((item: any) => item.fileSaveUrl)) ||
							(form.getFieldValue("exhibitionImg") &&
								form.getFieldValue("exhibitionImg").map((item: any) => item.fileSaveUrl)) ||
							[]
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("booth")) {
				let obj = {
					type: "booth",
					data: {}
				}
				let arr: any[] = []
				if (data.booth && data.booth.length > 0) {
					data.booth.forEach((item: any) => {
						let datas: { postionId: string; url: string } = {
							postionId: "",
							url: ""
						}
						datas.postionId = item.postionId
						datas.url = item.url[0].fileSaveUrl
						arr.push(datas)
					})
				} else if (form.getFieldValue("booth") && form.getFieldValue("booth").length > 0) {
					form.getFieldValue("booth").forEach((item: any) => {
						let datas: { postionId: string; url: string } = {
							postionId: "",
							url: ""
						}
						datas.postionId = item.postionId || ""
						datas.url = item.url[0].fileSaveUrl || ""
						arr.push(datas)
					})
				} else {
					let datas: { postionId: string; url: string } = {
						postionId: "",
						url: ""
					}

					arr.push(datas)
				}

				obj.data["booth"] = arr

				Arr.push(obj)
			}
			// 模板2数据提交
			if (pageList.includes("introduction1")) {
				let obj = {
					type: "introduction1",
					data: {
						mainTitle: data.mainTitle || form.getFieldValue("mainTitle") || "",
						subTitle: data.subTitle || form.getFieldValue("subTitle") || "",
						timePlace: data.timePlace || form.getFieldValue("timePlace") || "",
						atctiveIntroduction: data.atctiveIntroduction || form.getFieldValue("atctiveIntroduction") || "",
						logo:
							(data.logo && data.logo.length > 0 && data.logo[0].fileSaveUrl) ||
							(form.getFieldValue("logo") &&
								form.getFieldValue("logo").length > 0 &&
								form.getFieldValue("logo")[0].fileSaveUrl) ||
							"",
						backAudio:
							(data.backAudio && data.backAudio.length > 0 && data.backAudio[0].fileSaveUrl) ||
							(form.getFieldValue("backAudio") &&
								form.getFieldValue("backAudio").length > 0 &&
								form.getFieldValue("backAudio")[0].fileSaveUrl) ||
							""
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("guests1")) {
				let obj = {
					type: "guests1",
					data: {}
				}
				let arr: any[] = []
				if (data.guests && data.guests.length > 0) {
					data.guests.forEach((item: any) => {
						let datas: { title: string; content: string; img: string } = {
							title: "",
							content: "",
							img: ""
						}
						datas.title = item.title
						datas.content = item.content
						datas.img = item.img[0].fileSaveUrl
						arr.push(datas)
					})
				} else if (form.getFieldValue("guests") && form.getFieldValue("guests").length > 0) {
					form.getFieldValue("guests").forEach((item: any) => {
						let datas: { title: string; content: string; img: string } = {
							title: "",
							content: "",
							img: ""
						}
						datas.title = item.title || ""
						datas.content = item.content || ""
						datas.img = (!!item.img[0] && item.img[0].fileSaveUrl) || ""
						arr.push(datas)
					})
				} else {
					let datas: { title: string; content: string; img: string } = {
						title: "",
						content: "",
						img: ""
					}

					arr.push(datas)
				}

				obj.data["guests"] = arr

				Arr.push(obj)
			}

			if (pageList.includes("highlights1")) {
				let obj = {
					type: "highlights1",
					data: {
						highlights: data.highlights || form.getFieldValue("highlights") || []
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("agenda1")) {
				let obj = {
					type: "agenda1",
					data: {
						agenda: data.agenda || form.getFieldValue("agenda") || []
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("guide1")) {
				let obj = {
					type: "guide1",
					data: {}
				}
				let arr: any[] = []
				if (data.guide && data.guide.length > 0) {
					data.guide.forEach((item: any) => {
						let datas: { content: string; url: string } = {
							content: "",
							url: ""
						}
						datas.content = item.content
						datas.url = item.url[0].fileSaveUrl
						arr.push(datas)
					})
				} else if (form.getFieldValue("guide") && form.getFieldValue("guide").length > 0) {
					form.getFieldValue("guide").forEach((item: any) => {
						let datas: { content: string; url: string } = {
							content: "",
							url: ""
						}
						datas.content = item.content || ""
						datas.url = (!!item.url[0] && item.url[0].fileSaveUrl) || ""
						arr.push(datas)
					})
				} else {
					let datas: { content: string; url: string } = {
						content: "",
						url: ""
					}

					arr.push(datas)
				}

				obj.data["guide"] = arr

				Arr.push(obj)
			}
			//模板3数据提交
			if (pageList.includes("global2")) {
				let obj = {
					type: "global2",
					data: {
						labelPic: data.labelPic && data.labelPic.length > 0 ? data.labelPic[0].fileSaveUrl : ""
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("cover2")) {
				let obj = {
					type: "cover2",
					data: {
						coverName: data.coverName || form.getFieldValue("coverName") || "",
						coverTime: data.coverTime || form.getFieldValue("coverTime") || "",
						coverAddress: data.coverAddress || form.getFieldValue("coverAddress") || "",
						coverAudio:
							(data.coverAudio && data.coverAudio.length > 0 && data.coverAudio[0].fileSaveUrl) ||
							(form.getFieldValue("coverAudio") &&
								form.getFieldValue("coverAudio").length > 0 &&
								form.getFieldValue("coverAudio")[0].fileSaveUrl) ||
							"",
						coverLogo:
							(data.coverLogo && data.coverLogo.length > 0 && data.coverLogo[0].fileSaveUrl) ||
							(form.getFieldValue("coverLogo") &&
								form.getFieldValue("coverAudio").length > 0 &&
								form.getFieldValue("coverLogo")[0].fileSaveUrl) ||
							""
					}
				}
				Arr.push(obj)
			}

			if (pageList.includes("introduction2")) {
				let obj = {
					type: "introduction2",
					data: {
						introductionTitle: data.introductionTitle || form.getFieldValue("introductionTitle") || "",
						introductionDetail: data.introductionDetail || form.getFieldValue("introductionDetail") || "",
						introductionSign: data.introductionSign || form.getFieldValue("introductionSign") || "",
						introductionDate: data.introductionDate || form.getFieldValue("introductionDate") || ""
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("agenda2")) {
				let obj = {
					type: "agenda2",
					data: {
						agenda: data.agenda || form.getFieldValue("agenda") || []
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("display2")) {
				let obj = {
					type: "display2",
					data: {
						display: data.display || form.getFieldValue("display") || []
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("activity2")) {
				let obj = {
					type: "activity2",
					data: {
						activityAddress: data.activityAddress || form.getFieldValue("activityAddress") || "",
						activityTime: data.activityTime || form.getFieldValue("activityTime") || "",
						activityTitle: data.activityTitle || form.getFieldValue("activityTitle") || "",
						longitude: loacObj.longitude || "",
						latitude: loacObj.latitude || ""
					}
				}

				Arr.push(obj)
			}
			if (pageList.includes("exhibition2")) {
				let obj = {
					type: "exhibition2",
					data: {
						exhibitionImg:
							(data.exhibitionImg && data.exhibitionImg.map((item: any) => item.fileSaveUrl)) ||
							(form.getFieldValue("exhibitionImg") &&
								form.getFieldValue("exhibitionImg").map((item: any) => item.fileSaveUrl)) ||
							[]
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("booth2")) {
				let obj = {
					type: "booth2",
					data: {}
				}
				let arr: any[] = []
				if (data.booth && data.booth.length > 0) {
					data.booth.forEach((item: any) => {
						let datas: { postionId: string; url: string } = {
							postionId: "",
							url: ""
						}
						datas.postionId = item.postionId
						datas.url = item.url[0].fileSaveUrl
						arr.push(datas)
					})
				} else if (form.getFieldValue("booth") && form.getFieldValue("booth").length > 0) {
					form.getFieldValue("booth").forEach((item: any) => {
						let datas: { postionId: string; url: string } = {
							postionId: "",
							url: ""
						}
						datas.postionId = item.postionId || ""
						datas.url = item.url[0].fileSaveUrl || ""
						arr.push(datas)
					})
				} else {
					let datas: { postionId: string; url: string } = {
						postionId: "",
						url: ""
					}

					arr.push(datas)
				}

				obj.data["booth"] = arr

				Arr.push(obj)
			}
			//公共模块
			if (pageList.includes("registration")) {
				let registrationListData = []
				if (dyFormsRef.current) {
					registrationListData = dyFormsRef.current.getFormData()
				} else {
					registrationListData = dyFormsData || []
				}
				let obj = {
					type: "registration",
					data: {
						registrationList: registrationListData
					}
				}
				Arr.push(obj)
			}
			if (pageList.includes("code")) {
				let obj = {
					type: "code",
					data: {
						codeurl: data.codeurl || form.getFieldValue("codeurl") || "",
						codeimg:
							(data.codeimg && data.codeimg.length > 0 && data.codeimg[0].fileSaveUrl) ||
							(form.getFieldValue("codeimg") &&
								form.getFieldValue("codeimg").length > 0 &&
								form.getFieldValue("codeimg")[0].fileSaveUrl) ||
							""
					}
				}
				Arr.push(obj)
			}
			let info = JSON.stringify(Arr)
			if (!copy) {
				serviceManage.updateInvitaion({ id, info, pages: JSON.stringify(pageList) }).then(res => {
					if (res.code === 200) {
						modalRef.current.destroy()
					} else {
						message.error(res.msg)
					}
				})
			} else {
				const params = {
					templateId: templateId,
					name: invitName + "_复制",
					pages: JSON.stringify(pageList),
					info
				}
				serviceManage.createInvitaion(params).then(res => {
					if (res.code === 200) {
						eventBus.emit("doInvitation")
						modalRef.current.destroy()
						message.success("复制成功")
						// form.resetFields()
					} else {
						message.error(res.msg)
					}
				})
			}
		},
		[dyFormsData, pageList, invitName, pageList]
	)

	useEffect(() => {
		if (id) {
			serviceManage.getInvitation({ id }).then(res => {
				if (res.code === 200) {
					//setPageList(JSON.parse(res.data.pages))
					setPageList(JSON.parse(res.data.pages))
					setTemplateId(res.data.templateId)
					setInvitName(res.data.name)
					if (res.data.info) {
						let datas = JSON.parse(res.data.info)
						let fieldsdata = {}
						datas.forEach(item => Object.assign(fieldsdata, { ...item.data }))

						if (res.data.templateId == 1) {
							form.setFieldsValue({
								...fieldsdata,
								coverAudio: fieldsdata.coverAudio ? formatFile(fieldsdata.coverAudio) : null,
								coverLogo: fieldsdata.coverLogo ? formatFile(fieldsdata.coverLogo) : null,
								labelPic: fieldsdata.labelPic ? formatFile(fieldsdata.labelPic) : null,
								codeimg: fieldsdata.codeimg ? formatFile(fieldsdata.codeimg) : null,
								exhibitionImg: fieldsdata.exhibitionImg ? formatFile(fieldsdata.exhibitionImg) : null,
								booth:
									fieldsdata.booth && fieldsdata.booth.length > 0 && fieldsdata.booth[0].postionId
										? formatdata(fieldsdata.booth)
										: null
							})
						}
						if (res.data.templateId == 2) {
							form.setFieldsValue({
								...fieldsdata,
								logo: fieldsdata.logo ? formatFile(fieldsdata.logo) : null,
								backAudio: fieldsdata.backAudio ? formatFile(fieldsdata.backAudio) : null,
								codeimg: fieldsdata.codeimg ? formatFile(fieldsdata.codeimg) : null,
								guests:
									fieldsdata.guests && fieldsdata.guests.length > 0 && fieldsdata.guests[0].img
										? formatImgList(fieldsdata.guests, "guests")
										: null,
								guide:
									fieldsdata.guide && fieldsdata.guide.length > 0 && fieldsdata.guide[0].url
										? formatImgList(fieldsdata.guide, "guide")
										: null
							})
						}
						if (res.data.templateId == 3) {
							console.log(formatFile(fieldsdata.exhibitionImg))
							form.setFieldsValue({
								...fieldsdata,
								coverAudio: fieldsdata.coverAudio ? formatFile(fieldsdata.coverAudio) : null,
								coverLogo: fieldsdata.coverLogo ? formatFile(fieldsdata.coverLogo) : null,
								labelPic: fieldsdata.labelPic ? formatFile(fieldsdata.labelPic) : null,
								codeimg: fieldsdata.codeimg ? formatFile(fieldsdata.codeimg) : null,
								exhibitionImg: fieldsdata.exhibitionImg ? formatFile(fieldsdata.exhibitionImg) : null,
								booth:
									fieldsdata.booth && fieldsdata.booth.length > 0 && fieldsdata.booth[0].postionId
										? formatdata(fieldsdata.booth)
										: null
							})
						}
						setDyFormsData(fieldsdata.registrationList)
						if (fieldsdata.longitude) {
							loacObj = {
								address: "",
								longitude: fieldsdata.longitude,
								latitude: fieldsdata.latitude
							}
							setloc({ longitude: fieldsdata.longitude, latitude: fieldsdata.latitude })
						}
						if (fieldsdata.introductionDetail) {
							setIntroductiondetail(fieldsdata.introductionDetail)
						}
					}

					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			setDone(true)
		}
	}, [])

	useEffect(() => {
		setPanesList(initialPanes.filter(item => pageList.find(page => page == item.key)))
		// pageList.includes(item.key)))
	}, [pageList, introductiondetail, dyFormsData])

	// 抛出事件
	useEffect(() => {
		eventBus.on("setlocation", e => {
			form.setFieldsValue({
				address: e.address,
				longitude: e.location.lat,
				latitude: e.location.lat
			})
			loacObj = {
				address: e.address,
				longitude: e.location.lat,
				latitude: e.location.lng
			}
		})
		return () => {
			eventBus.off("setlocation")
		}
	}, [])

	let onEdit = useCallback(
		(targetKey: string, action: string) => {
			if (action == "remove" && pageList.find((value, index, item) => value == "global") && panesList.length > 2) {
				setPageList(pageList.filter(page => page != targetKey))
				setPanesList(panesList.filter(pane => pane.key != targetKey))
			} else if (
				action == "remove" &&
				!pageList.find((value, index, item) => value == "global") &&
				panesList.length > 1
			) {
				setPageList(pageList.filter(page => page != targetKey))
				setPanesList(panesList.filter(pane => pane.key != targetKey))
			}
		},
		[pageList, panesList]
	)

	return (
		done && (
			<Card
				style={{ width: 800 }}
				title="内容编辑"
				extra={
					<Space>
						<Button type="text" onClick={closeModal}>
							<CloseOutlined />
						</Button>
					</Space>
				}
			>
				<Form layout="horizontal" form={form} onFinish={onFinish} preserve style={{ minHeight: 300 }}>
					<Tabs defaultActiveKey="1" type="editable-card" hideAdd onEdit={onEdit}>
						{panesList.map(pane => (
							<TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
								{pane.content}
							</TabPane>
						))}
					</Tabs>

					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							确认
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</Form>
			</Card>
		)
	)
}

export default ContentEditModal
