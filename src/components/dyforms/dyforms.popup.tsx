import React, { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Form, Input, Select, Modal, Button, Alert } from "antd"
import { PlusCircleFilled, DeleteOutlined } from "@ant-design/icons"
import "./dyforms.context.less"
const { Option } = Select
const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
}

interface Props {
	isShowPop: boolean
	popType: string
	keyVal: number
	formArr: any[]
	changeShowPop: any
	name: string
	placeholder: string
	callBackData: (data: any) => void
}

const DyFormsPopup: React.FC<Props> = props => {
	const { isShowPop, popType, keyVal, formArr, changeShowPop, callBackData } = props
	const [itemList, setItemList] = useState<any[]>([])
	const [showAlert, setShowAlert] = useState<boolean>(false)
	const title = "表单信息设置"
	const [form] = Form.useForm()

	useEffect(() => {
		const { name, placeholder, formArr, keyVal } = props
		if (name) {
			form.setFieldsValue({
				name,
				placeholder
			})
		}

		if (formArr.length > 0 && formArr[keyVal].type === "select") {
			setItemList(formArr[keyVal].children)
		}
	}, [props])

	const handleCancel = () => {
		changeShowPop(false)
	}
	const onFinish = (data: any) => {
		if (popType === "editInput") {
			if (data.name && data.placeholder) {
				setShowAlert(false)
				const { name, placeholder } = data
				const arr = [...formArr]
				arr[keyVal] = Object.assign(arr[keyVal], {
					name,
					placeholder
				})
				callBackData(arr)
				changeShowPop(false)
			} else {
				setShowAlert(true)
			}
		} else {
			let name: any = ""
			Object.values(data).forEach((val, i) => {
				if (i === 0) {
					name = val
				} else {
					itemList[i - 1].title = val
				}
			})
			formArr[keyVal].name = name
			formArr[keyVal].children = itemList
			callBackData(formArr)
			changeShowPop(false)
		}
	}

	const onFinishFailed = (errorInfo: any) => {}

	const addFromItem = useCallback(
		id => {
			let data = {
				id: itemList.length + 1,
				title: ""
			}
			setItemList([...itemList, data])
		},
		[itemList]
	)

	const delFromItem = useCallback(
		(key: any) => {
			let list = [...itemList]
			list.splice(key, 1)
			setItemList(list)
		},
		[itemList]
	)

	const showContent = (type: string) => {
		if (type === "editInput") {
			return (
				<Form labelCol={{ span: 4 }} name="basic" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
					<Form.Item label="标题：" name="name">
						<Input />
					</Form.Item>
					<Form.Item label="提示信息：" name="placeholder">
						<Input />
					</Form.Item>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={handleCancel}>
							取消
						</Button>
					</Form.Item>
				</Form>
			)
		} else if (type === "editSelect") {
			return (
				<Form labelCol={{ span: 4 }} name="basic" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
					<Form.Item label="标题：" name="name">
						<Input />
					</Form.Item>
					{itemList.map((item, key) => {
						const { title } = item
						const id = `${key + 3}`
						return (
							<div key={key} className="formItems">
								<Form.Item
									label={`子项${key + 1}：`}
									style={{ marginBottom: "24px" }}
									name={`title${key}`}
									initialValue={title}
								>
									<Input style={{ width: "340px" }} />
								</Form.Item>
								{key === 0 && <PlusCircleFilled className="icon-up" onClick={addFromItem}></PlusCircleFilled>}
								{key > 1 && <DeleteOutlined className="icon-up" onClick={delFromItem.bind(this, key)}></DeleteOutlined>}
							</div>
						)
					})}
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={handleCancel}>
							取消
						</Button>
					</Form.Item>
				</Form>
			)
		}
	}

	return (
		<div className="m-table-pops">
			<Modal title={title} visible={isShowPop} footer={[]} onCancel={handleCancel}>
				<div style={{ display: showAlert ? "block" : "none", marginBottom: "24px" }}>
					<Alert message="请填写标题或提示信息" type="error" showIcon />
				</div>
				{showContent(popType)}
			</Modal>
		</div>
	)
}

export default DyFormsPopup
