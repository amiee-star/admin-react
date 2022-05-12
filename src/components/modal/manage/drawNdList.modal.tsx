import { CloseOutlined, PlusOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Table, Modal, Select, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"

const regxSPhone = /^1[3456789]\d{9}$/

const { Option } = Select

interface Props {
	id: string
}

interface Item {
	key: string
	awardsName: string
	accountName: string
	mobile: string
}

var typeList: { name: string; id: string }[] = []

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean
	dataIndex: string
	title: any
	inputType: "number" | "text" | "select"
	record: Item
	index: number
	children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
	editing,
	dataIndex,
	title,
	inputType,
	record,
	index,
	children,
	...restProps
}) => {
	const inputNode =
		inputType === "select" ? (
			<Select disabled placeholder="请选择奖项">
				{typeList.map((item, index) => {
					return (
						<Option key={item.id} value={item.id}>
							{item.name}
						</Option>
					)
				})}
			</Select>
		) : (
			<Input />
		)

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{ marginBottom: 0 }}
					rules={[
						{
							required: true,
							message: `请填写${title}!`
						}
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	)
}

let mark = true

const DataValueDom = {
	awardsName: "select",
	accountName: "text",
	mobile: "number"
}

const DrawNdList: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [done, setDone] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const [form] = Form.useForm()
	const [form1] = Form.useForm()
	const [TData, setTData] = useState([])
	const [list, setList] = useState([])
	const [editingKey, setEditingKey] = useState("")

	const [isAdd, setIsAdd] = useState<boolean>(false)

	const isEditing = (record: Item) => record.key === editingKey

	const edit = (record: Partial<Item> & { key: React.Key }) => {
		form.setFieldsValue({ ...record })
		setEditingKey(record.key)
	}

	const cancel = () => {
		setEditingKey("")
	}

	const deteleCell = (record: Partial<Item> & { key: React.Key }) => {
		let newData: Item[] = []
		TData.map(item => {
			if (item.key !== record.key) {
				newData.push(item)
			}
		})
		setTData(newData)
		// saveList(newData)
	}

	const add = useCallback(() => {
		setIsAdd(true)
	}, [])

	const save = async (key: React.Key) => {
		try {
			const row = (await form.validateFields()) as Item
			console.log(row)
			if (!regxSPhone.test(row.mobile)) {
				return message.info("请输入正确的手机号")
			}
			const newData = [...TData]
			const index = newData.findIndex(item => key === item.key)
			let awardsName = ""
			// typeList.findIndex( item => item.id ===  row.awardsName)
			typeList.map(item => {
				if (item.id === row.awardsName) {
					awardsName = item.name
				}
			})
			if (index > -1) {
				const item = newData[index]
				newData.splice(index, 1, {
					...item,
					...row,
					awardsName: awardsName,
					awardsId: row.awardsName
				})
				setTData(newData)
				setEditingKey("")
			} else {
				newData.push(row)
				setTData(newData)
				setEditingKey("")
			}
			// saveList(newData)
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo)
		}
	}

	const saveList = useCallback(
		(arr?) => {
			console.log(arr)
			let params = {
				id: id,
				arr: arr ? arr : TData
			}
			console.log(params)
			serviceManage.updateInnerWinners(params).then(res => {
				if (res.code === 200) {
					if (!arr) {
						closeModal()
					}
				} else {
					message.error(res.msg)
				}
			})
		},
		[TData]
	)

	const columns = [
		{
			title: "奖项名称",
			dataIndex: "awardsName",
			width: "25%",
			editable: true
		},
		{
			title: "中奖人姓名",
			dataIndex: "accountName",
			width: "25%",
			editable: true
		},
		{
			title: "中奖人手机号",
			dataIndex: "mobile",
			width: "30%",
			editable: true
		},
		{
			title: "操作",
			dataIndex: "operation",
			render: (_: any, record: Item) => {
				const editable = isEditing(record)
				return editable ? (
					<span>
						<a onClick={() => save(record.key)} style={{ marginRight: 8 }}>
							保存
						</a>
						<a onClick={cancel}>取消</a>
					</span>
				) : (
					<>
						{/* <span style={{
                            color: "#1890ff",
                            cursor: "pointer"
                        }} onClick={() => edit(record)}>编辑</span> */}
						<span
							style={{
								color: "#ff4d4f",
								marginLeft: "30px",
								cursor: "pointer"
							}}
							onClick={() => deteleCell(record)}
						>
							删除
						</span>
					</>
				)
			}
		}
	]

	const mergedColumns = columns.map(col => {
		if (!col.editable) {
			return col
		}
		return {
			...col,
			onCell: (record: Item) => ({
				record,
				inputType: DataValueDom[col.dataIndex],
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record)
			})
		}
	})
	const onFinish = useCallback(
		data => {
			console.log(data)
			if (!regxSPhone.test(data.mobile)) {
				return message.info("请输入正确的手机号")
			}
			let params = {
				id: id,
				arr: [
					{
						...data,
						awardsName: list[data.awardsName]
					},
					...TData
				]
			}
			serviceManage.updateInnerWinners(params).then(res => {
				form1.resetFields()

				if (res.code === 200) {
					getTList()
					setIsAdd(false)
				} else {
					message.error(res.msg)
				}
			})
		},
		[list, TData]
	)

	const getTList = useCallback(() => {
		serviceManage.searchInnerWinners({ id: id }).then(res => {
			if (res.code === 200) {
				let arr: Item[] = []
				if (res.data && res.data.length) {
					res.data.map((item, index) => {
						let obj = {
							...item,
							key: index + ""
						}
						arr.push(obj)
					})
				}
				setTData(arr)
			} else {
				message.error(res.msg)
			}
			setDone(true)
		})
	}, [])

	useEffect(() => {
		if (id) {
			serviceManage.searchAwardsName({ id: id }).then(res => {
				if (res.code === 200) {
					typeList = res.data
					setList(res.data)
					getTList()
				} else {
					message.error(res.msg)
				}
			})
		} else {
			setDone(true)
		}
	}, [])

	return (
		done && (
			<Card
				style={{ width: 800 }}
				title={"内定名单"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form form={form} component={false}>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" onClick={add}>
							新增
						</Button>
					</Form.Item>

					<Table
						components={{
							body: {
								cell: EditableCell
							}
						}}
						bordered
						dataSource={TData}
						columns={mergedColumns}
						rowClassName="editable-row"
						pagination={{
							onChange: cancel
						}}
					/>

					<Form.Item style={{ textAlign: "right" }}>
						<Button style={{ marginLeft: 10 }} type="primary" onClick={() => saveList()}>
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</Form>
				<Modal title="新增" visible={isAdd} footer={null} onCancel={() => setIsAdd(false)}>
					<Form
						layout="horizontal"
						labelCol={{ span: 5 }}
						wrapperCol={{ span: 19 }}
						form={form1}
						preserve={false}
						onFinish={onFinish}
					>
						<Form.Item
							rules={[
								{
									required: true,
									message: "请选择奖项!"
								}
							]}
							label="奖项名称："
							name="awardsId"
						>
							<Select placeholder="请选择奖项">
								{list.map((item, index) => {
									return (
										<Option key={item.id} value={item.id}>
											{item.name}
										</Option>
									)
								})}
							</Select>
						</Form.Item>

						<Form.Item
							rules={[
								{
									required: true,
									message: "请输入中奖人姓名!"
								}
							]}
							label="中奖人姓名："
							name="accountName"
						>
							<Input maxLength={20} placeholder="请输入中奖人姓名" />
						</Form.Item>

						<Form.Item
							rules={[
								{
									required: true,
									message: "请输入中奖人手机号!"
								}
							]}
							label="中奖手机号："
							name="mobile"
						>
							<Input type="number" maxLength={11} placeholder="请输入中奖人手机号" />
						</Form.Item>

						<Form.Item style={{ textAlign: "right" }}>
							<Button type="primary" htmlType="submit">
								保存
							</Button>
							<Button style={{ marginLeft: 10 }} htmlType="button" onClick={() => setIsAdd(false)}>
								取消
							</Button>
						</Form.Item>
					</Form>
				</Modal>
			</Card>
		)
	)
}

export default DrawNdList
