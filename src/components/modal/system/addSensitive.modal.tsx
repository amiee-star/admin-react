import { CloseOutlined, SafetyOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Radio, Select, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import md5 from "js-md5"
import serviceSys from "@/services/service.sys"

const { Option } = Select
interface Props {
	id: number
}
let mark = true
const addSensitiveModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [roles, setRoles] = useState([])
	const [showPassWord, setShowPassWord] = useState(true)
	//敏感词分类
	const [sensitiveClass, setSensitiveClass] = useState([])
	useEffect(() => {
		serviceSys.getSensitiveClass({ dictType: "sensitive_word" }).then(res => {
			setSensitiveClass(res.data)
		})
	}, [])
	useEffect(() => {
		if (!!props.id) {
			setShowPassWord(false)
		}
	}, [])
	// 初始加载获取角色列表
	useEffect(() => {
		serviceSys.getRole({}).then(res => {
			setRoles(res.data.entities)
		})
	}, [])
	const onFinish = useCallback((data: any) => {
		if (!mark) return
		mark = false
		const params = {
			typeId: data.typeId,
			name: data.name,
			id: !!props.id ? props.id : undefined
		}
		serviceSys[!!props.id ? "setSensitive" : "addSensitive"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doSensitive", !!props.id)
					form.resetFields()
					closeModal()
					message.success(!!props.id ? "编辑成功" : "新增成功")
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])
	useEffect(() => {
		if (props.id) {
			serviceSys.getSensitiveById({ id: props.id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						// typeId: res.data.typeId,
						// name: res.data.name
						...res.data
					})
				} else {
					message.error(res.msg)
				}
			})
		}
	}, [props.id])
	const editPassWord = () => {
		setShowPassWord(true)
	}
	return (
		<Card
			style={{ width: 530 }}
			title={props.id ? "创建" : "编辑"}
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
				// initialValues={{
				// 	active: true
				// }}
			>
				<Form.Item label="分类：" name="typeId" rules={[{ required: true, message: "请选择分类" }]}>
					<Select placeholder={"全部"}>
						{sensitiveClass.map(item => (
							<Option key={item.id} value={item.id}>
								{item.dictValue}
							</Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入敏感词名称!" }]}>
					<Input />
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

export default addSensitiveModal
