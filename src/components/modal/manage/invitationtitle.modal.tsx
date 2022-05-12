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

interface Props {
	id: string
}
const InvitationTitleModal: React.FC<Props & ModalRef> = props => {
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const { modalRef, id } = props
	const [form] = useForm()
	const [done, setDone] = useState(false)
	let mark = true

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		const params = {
			id,
			name: data.name
		}
		serviceManage.updateInvitaion(params).then(res => {
			if (res.code === 200) {
				modalRef.current.destroy()
				eventBus.emit("doInvitation")
			} else {
				message.error(res.msg)
			}
		})
	}, [])

	useEffect(() => {
		if (id) {
			serviceManage.getInvitation({ id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			setDone(true)
		}
	}, [])

	return (
		done && (
			<Card
				style={{ width: 450 }}
				title="邀请函名称修改"
				extra={
					<Space>
						<Button type="text" onClick={closeModal}>
							<CloseOutlined />
						</Button>
					</Space>
				}
			>
				<Form layout="horizontal" form={form} onFinish={onFinish} preserve>
					<Form.Item name="name">
						<Input></Input>
					</Form.Item>
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

export default InvitationTitleModal
