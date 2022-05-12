import { investListItem, invitationTemplates } from "@/interfaces/api.interface"
import serviceManage from "@/services/service.manage"
import "./addInvestigation.model.less"
import {
	CheckCircleOutlined,
	CloseOutlined,
	DeleteOutlined,
	DragOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined
} from "@ant-design/icons"
import { Button, Card, Input, Form, Space, Row, Col, Switch, message, Select, Radio, Checkbox } from "antd"
import { useForm } from "antd/lib/form/Form"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import SortItem from "@/components/utils/sort.item"
import eventBus from "@/utils/event.bus"
import ContentEditModal from "./contentEdit.modal"
import ChoosePages from "@/components/invitmodule/choosePages"
import urlFunc from "@/utils/url.func"
import "./choosePage.modal.less"
const { Option } = Select
interface Props {
	item: invitationTemplates
}

const ChoosePageModal: React.FC<Props & ModalRef> = props => {
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const { modalRef, item } = props
	const { pageInfo } = item
	const [form] = useForm()
	const [done, setDone] = useState(false)
	let mark = true

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	let pg = pageInfo.map(item => {
		return item.type
	})

	const pageinit = [
		{
			data: { labelPic: "invitationLabelDefault.png" },
			type: "global"
		},
		{
			data: { coverName: "", coverAudio: "dahua-default.mp3", coverLogo: "invitationDefaultLogo.png" },
			type: "cover"
		},
		{
			data: { introductionDate: "", introductionDetail: "", introductionSign: "", introductionTitle: "" },
			type: "introduction"
		},
		{
			data: { agenda: [] },
			type: "agenda"
		},
		{
			data: { display: [] },
			type: "display"
		},
		{
			data: { activityAddress: "", activityTime: "", latitude: "", longitude: "" },
			type: "activity"
		},
		{
			data: { exhibitionImg: [] },
			type: "exhibition"
		},
		{
			data: { booth: [{ postionId: "", url: "" }] },
			type: "booth"
		},

		//第二套模板
		{
			data: {
				mainTitle: "",
				subTitle: "",
				timePlace: "",
				activeIntroduction: "",
				logo: "dahua-default-2-log.png",
				backAudio: "dahua-default.mp3"
			},
			type: "introduction1"
		},
		{
			data: { guests: [] },
			type: "guests1"
		},
		{
			data: { highlights: [] },
			type: "highlights1"
		},
		{
			data: { agenda: [] },
			type: "agenda1"
		},
		{
			data: { guide: [{ postionId: "", url: "" }] },
			type: "guide1"
		},
		//第三套模板

		{
			data: { labelPic: "dahua-default-3-log.png" },
			type: "global2"
		},
		{
			data: { coverName: "", coverAudio: "dahua-default.mp3", coverLogo: "invitationDefaultLogo.png" },
			type: "cover2"
		},
		{
			data: { introductionDate: "", introductionDetail: "", introductionSign: "", introductionTitle: "" },
			type: "introduction2"
		},
		{
			data: { agenda: [] },
			type: "agenda2"
		},
		{
			data: { display: [] },
			type: "display2"
		},
		{
			data: { activityAddress: "", activityTime: "", latitude: "", longitude: "" },
			type: "activity2"
		},
		{
			data: { exhibitionImg: [] },
			type: "exhibition2"
		},
		{
			data: { booth: [{ postionId: "", url: "" }] },
			type: "booth2"
		},

		//公共模块
		{
			data: { registrationList: [] },
			type: "registration"
		},

		{
			data: { codeurl: "扫码关注大华股份官方微信", codeimg: "invitationCodeDefault.png" },
			type: "code"
		}
	]
	const onFinish = useCallback(data => {
		if (data.pages.length < 1) {
			return message.error("请至少选择一个页面")
		}
		if (!mark) return
		mark = false
		if (item.id == 1 || item.id == 3) {
			data.pages.unshift("global") //手动增加一个页面
		} else if (item.id == 2) {
			data.pages.push("code") //手动增加一个页面
		}
		const params = {
			templateId: item.id,
			name: data.name,
			pages: JSON.stringify(data.pages)
		}

		let infos = pageinit.filter(item => JSON.parse(params.pages).find((page: string) => page == item.type))
		params.info = JSON.stringify(infos)
		serviceManage
			.createInvitaion(params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doInvitation")
					modalRef.current.destroy()
					message.success("创建成功")
					form.resetFields()
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])

	return (
		// done &&
		<Card
			style={{ width: 650 }}
			title="选择模板"
			extra={
				<Space>
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				</Space>
			}
		>
			<Form layout="horizontal" form={form} onFinish={onFinish} preserve initialValues={{ pages: pg }}>
				<Form.Item
					label="邀请函名称"
					name="name"
					wrapperCol={{ span: 16 }}
					rules={[{ required: true, message: "请输入邀请函名称" }]}
				>
					<Input maxLength={15} />
				</Form.Item>
				<Form.Item name="pages">
					<Checkbox.Group>
						<Row style={{ width: "100%" }}>
							{pageInfo.map(page => {
								return (
									<div key={page.type} className="wrapper1">
										<div className="title">{page.name}</div>
										<div className="box">
											<img src={!!page.img ? `${urlFunc.getHost("imageUrl")}/${page.img}` : ""} className="img" />
											<Checkbox
												defaultChecked
												value={page.type}
												style={{ lineHeight: "32px" }}
												className="checkbox"
											></Checkbox>
										</div>
									</div>
								)
							})}
						</Row>
					</Checkbox.Group>
				</Form.Item>
				<Form.Item style={{ textAlign: "center" }}>
					<Button type="primary" htmlType="submit">
						确认
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default ChoosePageModal
