import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import serviceManage from "@/services/service.manage"

interface Props {
	id: number | string
	title: string
	roomId: string
}
const AddLiveStreamModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id, title, roomId } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const params = !!id
			? {
					...data,
					exhibitionId,
					id
			  }
			: {
					...data,
					exhibitionId
			  }
		serviceManage[!!id ? "updataLiveStream" : "addLiveStream"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doLiveStreamList")
					modalRef.current.destroy()
					message.success(id ? "修改成功" : "新增成功")
					form.resetFields()
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])

	useEffect(() => {
		if (id) {
			form.setFieldsValue({
				id,
				title,
				roomId
			})
			setDone(true)
		} else {
			setDone(true)
		}
	}, [])
	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={props.id == "" ? "新增直播管理" : "编辑直播管理"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false} onFinish={onFinish}>
					<Form.Item label="直播标题：" name="title" rules={[{ required: true, message: "请输入直播标题" }]}>
						<TextArea placeholder="请输入直播标题" showCount maxLength={50} />
					</Form.Item>
					<Form.Item label="直播ID：" name="roomId" rules={[{ required: true, message: "请输入直播ID" }]}>
						<Input type="number" placeholder="请输入直播ID" />
					</Form.Item>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							保存
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

export default AddLiveStreamModal
