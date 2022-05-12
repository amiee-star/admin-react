import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Checkbox, Input, Select, Modal } from "antd"
import { DragOutlined, SettingOutlined, DeleteOutlined } from "@ant-design/icons"
import DyFormsPopup from "./dyforms.popup"
import "./dyforms.context.less"
const { Option } = Select
let indexs = 0
interface Props {
	cRef: any
	defaultContent: any
}

const DyForms: React.FC<Props> = props => {
	const { cRef, defaultContent = [] } = props
	const [formArr, setFormArr] = useState<any[]>([])
	const [isShowEditPop, setShowEditPop] = useState<boolean>(false)
	const [isShowDelPop, setShowDelPop] = useState<boolean>(false)
	const [popType, setPopType] = useState<string>()
	const [keyVal, setKeyVal] = useState<number>(0)
	const [selectList, setSelectList] = useState([
		{
			id: 1,
			title: "默认"
		}
	])
	const [formTitle, setformTitle] = useState<string>()
	const [formTips, setformTips] = useState<string>()
	const [selectData, setSelectData] = useState<any[]>([
		{
			type: "input",
			name: "单行文本",
			placeholder: "请输入",
			rules: "",
			isRequired: false,
			children: []
		},
		{
			type: "textArea",
			name: "多行文本",
			placeholder: "请输入",
			rules: "",
			isRequired: false,
			children: []
		},
		{
			type: "select",
			name: "下拉框",
			placeholder: "请输入",
			rules: "",
			isRequired: false,
			children: [
				{
					id: 1,
					title: "默认"
				}
			]
		}
	])

	useEffect(() => {
		if (defaultContent.length > 0) {
			setFormArr(defaultContent)
		}
	}, [defaultContent])

	useImperativeHandle(cRef, () => ({
		getFormData: () => {
			return formArr
		}
	}))

	const addFromItem = useCallback(
		(item, data?) => {
			indexs++
			const { type } = item
			const { name, placeholder, rules = "", key, isRequired } = data || {}
			const newitem = Object.assign(item, { name, placeholder, rules, isRequired })
			const keyNum = `${key}${indexs}`
			const obj = {
				key: keyNum,
				...newitem
			}
			setPopType(type)
			setFormArr([...formArr, obj])
		},
		[formArr]
	)

	const delFromItem = (key: any) => {
		setKeyVal(key)
		setShowDelPop(true)
		setPopType("deletes")
	}

	const editFromItem = useCallback(
		(key: any, type: string, title: string, tipsTitle: string) => {
			setKeyVal(key)
			setformTitle(title)
			setformTips(tipsTitle)
			setShowEditPop(true)
			if (type === "select") {
				setPopType("editSelect")
			} else {
				setPopType("editInput")
			}
		},
		[keyVal]
	)

	const checkFromItem = (key: any, v: any) => {
		let list = [...formArr]
		list[key].isRequired = v.target.checked
		setFormArr(list)
	}

	const commonItems = () => {
		const listData = [
			{
				index: 0,
				name: "公司名称",
				key: "company",
				rules: "companyRegexp",
				placeholder: "请输入公司名称",
				isRequired: true
			},
			{
				index: 0,
				name: "职位",
				key: "post",
				rules: "postRegexp",
				placeholder: "请输入职位",
				isRequired: true
			},
			{
				index: 0,
				name: "姓名",
				key: "names",
				rules: "namesRegexp",
				placeholder: "请输入姓名",
				isRequired: true
			},
			{
				index: 0,
				name: "电话",
				key: "phone",
				rules: "phoneRegexp",
				placeholder: "请输入电话",
				isRequired: true
			},
			{
				index: 0,
				name: "邮箱",
				key: "email",
				rules: "emailRegexp",
				placeholder: "请输入邮箱",
				isRequired: true
			},
			{
				index: 1,
				name: "备注",
				key: "remark",
				rules: "remarkRegexp",
				placeholder: "请输入备注",
				isRequired: true
			}
		]
		return (
			<ul className="f-list-mline">
				{listData.map((item, key) => {
					return (
						<li key={key} onClick={() => addFromItem(selectData[item.index], item)}>
							{item.name}
						</li>
					)
				})}
			</ul>
		)
	}

	const customItems = () => {
		const listData = [
			{
				index: 0,
				name: "单行文本",
				key: "singleline",
				placeholder: "请输入单行文本"
			},
			{
				index: 1,
				name: "多行文本",
				key: "mulline",
				placeholder: "请输入多行文本"
			},
			{
				index: 2,
				name: "下拉框",
				key: "select",
				placeholder: "请选择"
			}
		]
		return (
			<ul className="f-list-sline">
				{listData.map((item, key) => {
					return (
						<li key={key} onClick={() => addFromItem(selectData[item.index], item)}>
							<DragOutlined className="dragicon" />
							{item.name}
							<img className="ico" src={require("@/assets/images/backstage/add_form_img0" + (key + 1) + ".png")}></img>
						</li>
					)
				})}
			</ul>
		)
	}

	const inputItem = useCallback(
		(item: any) => {
			if (item.type === "input") {
				return <Input className="ipt" placeholder={`${item.placeholder}`} />
			} else if (item.type === "textArea") {
				return <Input.TextArea className="iparea" placeholder={`${item.placeholder}`} />
			} else if (item.type === "select") {
				return (
					<Select className="selet" placeholder={"请选择"}>
						{item.children.map((val: any) => (
							<Option key={val.id} value={val.id}>
								{val.title}
							</Option>
						))}
					</Select>
				)
			}
		},
		[selectList]
	)

	const confirmd = useCallback(() => {
		let list = [...formArr]
		list.splice(keyVal, 1)
		setFormArr(list)
		setShowDelPop(false)
	}, [keyVal, formArr])

	const cancel = () => {
		setShowDelPop(false)
	}

	const changeParentData = useCallback(
		(data: any) => {
			if (popType === "editInput") {
				setFormArr([...data])
			} else {
				setSelectList([...data])
			}
		},
		[formArr, popType]
	)

	const reorder = (list: any, startIndex: any, endIndex: any) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)
		return result
	}

	const onDragEnd = (result: any) => {
		if (!result.destination) {
			return
		}
		const newitems = reorder(formArr, result.source.index, result.destination.index)
		setFormArr(newitems)
	}

	return (
		<div className="m-table">
			<div className="m-table-l">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="droppable">
						{(provided: any, snapshot: any) => (
							<div
								//provided.droppableProps应用的相同元素.
								{...provided.droppableProps}
								// 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
								ref={provided.innerRef}
							>
								{formArr.map((item, key) => (
									<Draggable key={item.key} draggableId={item.key} index={key}>
										{(provided: any, snapshot: any) => (
											<div
												className="m-fromlist"
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<p className="tit">{item.name} :</p>
												{inputItem(item)}
												<div className="opera">
													<SettingOutlined
														className="settingicon"
														onClick={editFromItem.bind(this, key, item.type, item.name, item.placeholder)}
													/>
													<DeleteOutlined className="delicon" onClick={delFromItem.bind(this, key)} />
													<Checkbox defaultChecked={item.isRequired} onChange={checkFromItem.bind(this, key)}>
														必填
													</Checkbox>
												</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</div>
			<div className="m-table-r">
				<p className="f-tit">常用项</p>
				{commonItems()}
				<p className="f-tit">自定义项</p>
				{customItems()}
			</div>
			<Modal title="提示" visible={isShowDelPop} onOk={confirmd} onCancel={cancel}>
				<p>确定要删除吗？</p>
			</Modal>
			{isShowEditPop && (
				<DyFormsPopup
					key={keyVal}
					isShowPop={isShowEditPop}
					popType={popType}
					keyVal={keyVal}
					formArr={formArr}
					changeShowPop={setShowEditPop}
					name={formTitle}
					placeholder={formTips}
					callBackData={changeParentData}
				/>
			)}
		</div>
	)
}

export default DyForms
