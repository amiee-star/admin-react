import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Select } from "antd"
import React, { useCallback } from "react"
import serviceData from "@/services/service.data"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"

interface Props {
	id?: string
	item?: any
}
const UpdateTradeClassModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const { Option } = Select

	const onFinish = useCallback(data => {
		serviceData
			.updateTradeClass({
				id: props.item.id,
				// pid: 691,
				title: data.title,
				sort: data.sort,
				showType: data.showType
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doTradeClass")
					closeModal()
					message.success("编辑成功")
				} else {
					message.error(res.msg)
				}
			})
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title={"编辑分类"}
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
					label="分类名称："
					name="title"
					rules={[
						{ required: true, message: "请输入分类名称" },
						{ message: "请输入1-20个文字", max: 20 }
					]}
				>
					<Input placeholder="请输入分类名称（最多20个字符）" />
				</Form.Item>
				<Form.Item label="排序：" name="sort" rules={[{ required: true, message: "请输入分类排序" }]}>
					<InputNumber
						max={9999}
						min={0}
						step={1}
						formatter={limitNumber}
						parser={limitNumber}
						placeholder="请输入正整数"
						style={{ width: "380px" }}
					/>
				</Form.Item>
				{props.item.pid != 0 ? (
					<Form.Item label="显示类型：" name="showType" rules={[{ required: true, message: "请输入分类排序" }]}>
						<Select placeholder={"一级分类"}>
							<Option value={1}>行业</Option>
							<Option value={2}>产品</Option>
						</Select>
					</Form.Item>
				) : null}

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

export default UpdateTradeClassModal
