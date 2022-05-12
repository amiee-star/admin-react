import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message } from "antd"
import React, { useCallback } from "react"
import serviceSys from "@/services/service.sys"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"

interface Props {
	item: any
}
let mark = true
const AddDicModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const params = {
			...data,
			id: !!props.item.id ? props.item.id : undefined
		}
		serviceSys[!!props.item.id ? "editDictionaryList" : "addDictionaryList"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doDictionary")
					form.resetFields()
					closeModal()
					message.success(!!props.item.id ? "编辑成功" : "新增成功")
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title={!!props.item.id ? "编辑字典" : "新增字典"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 4 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				initialValues={props.item}
			>
				<Form.Item
					label="字典名称："
					name="dictName"
					rules={[
						{ required: true, message: "请输入字典名称" },
						{ message: "请输入1-20个文字", max: 255 }
					]}
				>
					<Input placeholder="请输入字典名称（最多255个字符）" />
				</Form.Item>
				<Form.Item
					label="字典类型："
					name="dictType"
					rules={[
						{ required: true, message: "请输入字典类型" },
						{ message: "请输入1-20个文字", max: 255 }
					]}
				>
					<Input placeholder="请输入字典类型（最多255个字符）" />
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
}

export default AddDicModal
