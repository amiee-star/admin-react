import { CloseOutlined, SafetyOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Radio, Select, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import md5 from "js-md5"
import serviceSys from "@/services/service.sys"

const { Option } = Select
interface Props {
	id: string
}
let mark = true
const AddUserModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [roles, setRoles] = useState([])
	const [showPassWord, setShowPassWord] = useState(true)
	useEffect(() => {
		if (!!props.id) {
			setShowPassWord(false)
		}
	}, [])
	// 初始加载获取角色列表
	useEffect(() => {
		serviceSys.getRole({ pageSize: 1000 }).then(res => {
			setRoles(res.data.entities)
		})
	}, [])
	const onFinish = useCallback((data: any) => {
		if (!mark) return
		mark = false
		const params = {
			username: data.username,
			password: !!data.password ? md5(data.password) : "",
			realName: data.realName,
			status: data.status,
			roleList: data.roleList,
			id: !!props.id ? props.id : undefined
		}
		serviceSys[!!props.id ? "editUser" : "addUser"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doAdminUser")
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
			serviceSys.getUserById({ id: props.id }).then(res => {
				if (res.code === 200) {
					const defautRoles: any[] = []
					if (!!res.data.roleList) {
						res.data.roleList.forEach((item: { id: any }) => {
							defautRoles.push(item.id)
						})
					}
					form.setFieldsValue({
						username: res.data.username,
						password: res.data.password,
						realName: res.data.realName,
						status: res.data.status,
						roleList: defautRoles
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
			title={props.id == "" ? "新增用户" : "管理用户"}
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
				<Form.Item label="账号名：" name="username" rules={[{ required: true, message: "请输入账号名!" }]}>
					<Input />
				</Form.Item>

				<Form.Item label="姓名：" name="realName" rules={[{ required: true, message: "请输入姓名!" }]}>
					<Input />
				</Form.Item>
				{props.id && (
					<Form.Item style={{ marginLeft: "80px" }}>
						<Button type="primary" icon={<SafetyOutlined />} onClick={editPassWord}>
							修改密码
						</Button>
					</Form.Item>
				)}

				{showPassWord && (
					<>
						<Form.Item label="密码：" name="password" rules={[
              { required: true, message: '请输入密码' },
              { min: 8, message:'密码不少于8位'},
              { pattern:new RegExp('^(?![a-zA-Z]+$)(?![A-Z\\d]+$)(?![A-Z_\\W]+$)(?![a-z\\d]+$)(?![a-z_\\W]+$)(?![\\d_\\W]+$)[a-zA-Z\\d_\\W]{8,}$','g'), message:'至少包含英文大写/英文小写/数字/特殊符号3种组合'}
            ]}>
							<Input.Password />
						</Form.Item>
						<Form.Item
							label="确认密码："
							name="rePassword"
							validateTrigger="onBlur"
							rules={[
								{ required: true, message: "请再次输入新密码" },
								({ getFieldValue }) => ({
									validator(_, value) {
										if (!value || getFieldValue("password") === value) {
											return Promise.resolve()
										}
										return Promise.reject("你两次输入的密码不一致")
									}
								})
							]}
						>
							<Input.Password />
						</Form.Item>
					</>
				)}
				<Form.Item label="激活状态：" name="status" rules={[{ required: true, message: "请选择激活状态" }]}>
					<Radio.Group>
						<Radio value={1}>启用</Radio>
						<Radio value={0}>禁用</Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item label="分配角色：" name="roleList" rules={[{ required: true, message: "请选择栏目" }]}>
					<Select placeholder={"角色"} mode="multiple">
						{roles &&
							roles.map(item => (
								<Option key={item.id} value={item.id}>
									{item.name}
								</Option>
							))}
					</Select>
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

export default AddUserModal
