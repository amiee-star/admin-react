import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Switch, InputNumber, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"

import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"

import serviceManage from "@/services/service.manage"
import limitNumber from "@/utils/checkNum.func"
import serviceScene from "@/services/service.scene"
import { MenuTypeItem } from "@/interfaces/api.interface"

interface Props {
	id: string
}
const AddsiteMapModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	let mark = true
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const [options, setOptions] = useState<{ label: string; value: number }[]>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	// const onChange = (checked: boolean) => {
	// 	setSwitchStatus(checked)
	// }

	const onFinish = useCallback(data => {
		if (!mark) return
		// mark = false
		const params = {
			...data,
			exhibitionId,
			id
		}

		serviceManage["updataSiteMap"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doSiteMapList")
					eventBus.emit("doStateNumber")

					modalRef.current.destroy()
					message.success("修改成功")
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
		let p1 = serviceManage.getMenuType().then(res => {
			if (res.code === 200) {
				let opts = res.data.map(item => {
					return { label: item.name, value: item.id }
				})
				setOptions(opts)
			}
		})
		let p2 = serviceManage.getSiteMapList({ id: props.id, exhibitionId }).then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data.entities[0],
					categoryId: res.data.entities[0].categoryId
				})
			} else {
				message.error(res.msg)
			}
		})
		Promise.all([p1, p2]).then(() => {
			setDone(true)
		})
	}, [])

	return (
		done && (
			<Card
				style={{ width: 530 }}
				title="编辑3D导览岛设置"
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 19 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					<Form.Item label="热点显示：" name="state" normalize={value => Number(value)} valuePropName="checked">
						<Switch defaultChecked />
					</Form.Item>
					<Form.Item label="热点名称：" name="title" rules={[{ required: true, message: "请输入热点名称" }]}>
						<Input maxLength={6} placeholder="请输入最大6个字符" />
					</Form.Item>
					<Form.Item label="排序：" name="sort">
						<InputNumber
							style={{ width: 200 }}
							max={999999}
							min={0}
							step={1}
							formatter={limitNumber}
							parser={limitNumber}
							placeholder="请输入正整数"
						/>
					</Form.Item>
					<Form.Item label="目录分类：" name="categoryId">
						<Select options={options} />
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

export default AddsiteMapModel
