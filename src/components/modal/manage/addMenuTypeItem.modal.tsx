import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message, InputNumber } from "antd"
import React, { useCallback, useEffect, useState } from "react"

import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import serviceManage from "@/services/service.manage"
import limitNumber from "@/utils/checkNum.func"
import { MenuTypeItem } from "@/interfaces/api.interface"

interface Props {
	item: MenuTypeItem
}
const AddMenuTypeItemModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, item } = props
	const [form] = Form.useForm()
	let mark = true
	const [done, setDone] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const params = {
			...data,
			id: item ? item.id : null
		}

		serviceManage[item ? "updateMenuType" : "addMenuType"](params)
			.then(res => {
				if (res.code === 200) {
					modalRef.current.destroy()
					message.success("更新成功")
					eventBus.emit("doMenuListModel")
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
		form.setFieldsValue({
			...item
		})
		setDone(true)
	}, [])

	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={item ? "编辑分类" : "添加分类"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 5 }}
					wrapperCol={{ span: 19 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					<Form.Item label="分类名称：" name="name" rules={[{ required: true, message: "请输入分类名称" }]}>
						<Input maxLength={20} placeholder="请输入分类名称(最多20个字符)" />
					</Form.Item>
					<Form.Item label="排序：" name="sort" rules={[{ required: true, message: "请输入序号" }]}>
						<InputNumber
							style={{ width: 200 }}
							max={9999}
							min={0}
							step={1}
							formatter={limitNumber}
							parser={limitNumber}
							placeholder="请输入正整数"
						/>
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

export default AddMenuTypeItemModel
