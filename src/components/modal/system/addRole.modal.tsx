import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Tree, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import serviceSys from "@/services/service.sys"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
interface Props {
	id: string
}
let mark = true
const AddRoleModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	let timer: NodeJS.Timeout = null
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [menuList, setMenuList] = useState([])
	// 初始加载菜单列表
	useEffect(() => {
		serviceSys.getMenuList({}).then(res => {
			setMenuList(res.data)
		})
	}, [])
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])

	const menuKeys = useRef([])
	const onCheck = (checkedKeys: any, info: { halfCheckedKeys: any }) => {
		let checkedKeysResult = [...checkedKeys, ...info.halfCheckedKeys]
		// 页面显示id
		setCheckedKeys(checkedKeys)
		// 传参的id
		menuKeys.current = checkedKeysResult
		//新增
		form.setFieldsValue({
			menuList: menuKeys.current
		})
	}
	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			const params = {
				name: data.name,
				remarks: data.remarks,
				menuList: menuKeys.current,
				id: !!props.id ? props.id : undefined
			}
			serviceSys[!!props.id ? "updateRole" : "addRole"](params)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doRoleInfo")
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
		},
		[checkedKeys]
	)
	useEffect(() => {
		if (props.id) {
			serviceSys.getRoleInfo({ id: props.id }).then(res => {
				if (res.code === 200) {
					const defaultKey: any[] = []
					if (!!res.data.menuList) {
						res.data.menuList.forEach((item: { id: number; pid: number }) => {
							if (item.pid !== 0) {
								defaultKey.push(item.id)
							}
						})
						setCheckedKeys(defaultKey)
						menuKeys.current = defaultKey
					}
					form.setFieldsValue({
						...res.data,
						menuList: defaultKey
					})
				} else {
					message.error(res.msg)
				}
			})
		}
	}, [props.id])

	const mapTree = (list: any[]) => {
		return list.map((m: { childMenuList: any; name: any; id: any }) => {
			return { ...m, children: m.childMenuList ? mapTree(m.childMenuList) : [], title: m.name, key: m.id }
		})
	}
	useEffect(() => {
		return () => {
			clearTimeout(timer)
		}
	}, [])
	return (
		<Card
			style={{ width: 530 }}
			title={props.id == "" ? "新增角色" : "编辑角色"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false} onFinish={onFinish}>
				<Form.Item
					label="角色名称："
					name="name"
					rules={[
						{ required: true, message: "请输入角色名称" },
						{ message: "请输入1-20个文字", max: 20 }
					]}
				>
					<Input placeholder="请输入角色名称（最多20个字符）" />
				</Form.Item>
				<Form.Item label="备注：" name="remarks">
					<TextArea rows={4} />
				</Form.Item>
				<Form.Item label="栏目选择：" name="menuList">
					{/* <Select placeholder={"栏目选择"} mode="multiple">
						{menuList.map(item => (
							<Option key={item.id} value={item.id}>
								{item.title}
							</Option>
						))}
					</Select> */}

					<Tree
						checkable
						defaultExpandAll
						selectable={false}
						checkedKeys={checkedKeys}
						onCheck={onCheck}
						treeData={!!menuList && mapTree(menuList)}
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
}

export default AddRoleModal
