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
import { Button, Card, Input, Form, Space, Row, Col, Switch, message, Select, Radio } from "antd"
import { useForm } from "antd/lib/form/Form"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import SortItem from "@/components/utils/sort.item"
import eventBus from "@/utils/event.bus"
import ContentEditModal from "./contentEdit.modal"
import serviceSys from "@/services/service.sys"
import ChoosePageModal from "./choosePage.modal"
const { Option } = Select
interface Props {}

const AddInvitationModal: React.FC<Props & ModalRef> = props => {
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const { modalRef } = props
	const [templates, setTemplates] = useState<invitationTemplates[]>([])
	const [chosenId, setChosenId] = useState<number>()
	const [form] = useForm()
	const [done, setDone] = useState(false)
	let mark = true

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const EditPages = useCallback((item: invitationTemplates) => {
		ModalCustom({
			content: ChoosePageModal,
			params: { item }
		})
	}, [])
	const onChange = useCallback(
		e => {
			setChosenId(e.target.value)
		},
		[chosenId]
	)
	const onFinish = useCallback(() => {
		if (chosenId) {
			let chosenItem = templates.filter(item => item.id == chosenId)[0]
			closeModal()
			EditPages(chosenItem)
		} else return
	}, [chosenId, templates])

	useEffect(() => {
		let arr: invitationTemplates[] = null
		serviceManage.getInvitationTemplates().then(res => {
			if (res.code == 200) {
				arr = res.data.entities.map(item => {
					return {
						id: item.id,
						name: item.name,
						pageInfo: JSON.parse(item.pageInfo)
					}
				})
				setTemplates(arr)
			}
		})
	}, [])

	return (
		// done &&
		<Card
			style={{ width: 500 }}
			title="选择模板"
			extra={
				<Space>
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				</Space>
			}
		>
			<Radio.Group value={chosenId} onChange={onChange}>
				<Space direction="horizontal">
					{templates.map(item => (
						<Radio key={item.id} value={item.id}>
							{item.name}
						</Radio>
					))}
				</Space>
			</Radio.Group>
			<Row>
				<Col offset={10}>
					<Button type="primary" onClick={onFinish} style={{ marginTop: "10px" }}>
						下一步
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

export default AddInvitationModal
