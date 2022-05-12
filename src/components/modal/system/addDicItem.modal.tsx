import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message } from "antd"
import React, { useCallback } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import serviceSys from "@/services/service.sys"

interface Props {
	id: string
	edit: number
	ids: string
	item: any
}
let mark = true
const AddDicItemModal: React.FC<Props & ModalRef> = props => {
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
			dictTypeId: props.id,
			id: props.ids
		}
		serviceSys[!!props.edit ? "editDictionaryItem" : "addDictionaryItem"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doDictionaryListModel")
					form.resetFields()
					closeModal()
					message.success(!!props.edit ? "编辑成功" : "新增成功")
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
			title={!props.edit ? "新增字典项" : "编辑字典项"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 5 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				initialValues={props.item}
			>
				<Form.Item
					label="字典项key："
					name="dictLabel"
					rules={[
						{ required: true, message: "请输入字典项key" },
						{ message: "请输入1-20个文字", max: 255 }
					]}
				>
					{/* style={{ marginLeft: "10px" }} */}
					<Input placeholder="请输入字典项key（最多255个字符）" />
				</Form.Item>
				<Form.Item
					label="字典项value："
					name="dictValue"
					rules={[
						{ required: true, message: "请输入字典项value" },
						{ message: "请输入1-20个文字", max: 255 }
					]}
				>
					<Input placeholder="请输入字典项value（最多255个字符）" />
				</Form.Item>
				<Form.Item label="备注" name="remark">
					<Input.TextArea placeholder="请输入字典项备注（最多100字）" />
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

export default AddDicItemModal
