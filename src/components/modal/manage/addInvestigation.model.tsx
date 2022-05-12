import { investListItem } from "@/interfaces/api.interface"
import serviceManage from "@/services/service.manage"
import "./addInvestigation.model.less"
import Sortable from "sortablejs"
import {
	CheckCircleOutlined,
	CloseOutlined,
	DeleteOutlined,
	DragOutlined,
	MinusCircleOutlined,
	PlusCircleOutlined,
	SettingOutlined
} from "@ant-design/icons"
import { Button, Card, Input, Form, Space, Row, Col, Switch, message } from "antd"
import { useForm } from "antd/lib/form/Form"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { ModalRef } from "../modal.context"
import SortItem from "@/components/utils/sort.item"
import eventBus from "@/utils/event.bus"
interface Props {
	id: number
}
interface subjectItem {
	isRequired: number
	topic: string
	type: number
	info?: infoItem[]
	remark: number
}

interface infoItem {
	choice: string
	content: string
}
const AddInvestigationModal: React.FC<Props & ModalRef> = props => {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const { modalRef, id } = props
	const [status, setStatus] = useState<number>(0)
	const [dan, setDan] = useState<number>(0)
	const [duo, setDuo] = useState<number>(0)
	const [wenda, setWenda] = useState<number>(0)
	const [form] = useForm()
	const [done, setDone] = useState(false)
	let mark = true

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const sortChange = useCallback(
		(moveFunc: any) => (e: Sortable.SortableEvent) => {
			const { oldIndex, newIndex } = e
			moveFunc(oldIndex, newIndex)
		},
		[]
	)

	const listTransform = useCallback((list: investListItem[]) => {
		list.forEach((subject: investListItem) => {
			if (subject.type !== 3) {
				subject.info = JSON.stringify(subject.info)
			} else {
				subject.remark = !!subject.remark ? "1" : ""
				subject.info = null
			}
		})
		return list
	}, [])
	const stringTransform = useCallback((list: investListItem[]) => {
		list.forEach(subject => {
			subject.info = !!subject.info ? JSON.parse(subject.info) : []
			subject.remark = !!subject.remark
		})
		return list
	}, [])

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false

		const params = !!id
			? {
					id: id,
					name: data.name,
					list: listTransform(data.list || []),
					exhibitionId
			  }
			: {
					name: data.name,
					list: listTransform(data.list || []),
					exhibitionId
			  }
		serviceManage
			.updateInvestigation(params)
			.then(res => {
				if (res.code === 200) {
					// message.success(!!id ? "修改成功" : "新增成功")
					eventBus.emit("doInvestigation")
					modalRef.current.destroy()
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])

	useEffect(() => {
		if (id) {
			serviceManage.getInvestigation({ id: props.id, exhibitionId }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						name: res.data.name,
						list: stringTransform(res.data.list)
					})
					setStatus(res.data.status)
					for (let i = 0; i < res.data.list.length; i++) {
						res.data.list[i].type === 1 && setDan(dan => dan + 1)
						res.data.list[i].type === 2 && setDuo(duo => duo + 1)
						res.data.list[i].type === 3 && setWenda(wenda => wenda + 1)
					}
					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			setDone(true)
		}
	}, [])

	const addSubject = useCallback(
		(type: number) => () => {
			const hasSubject: subjectItem[] = form.getFieldValue("list") || []
			form.setFields([
				{ name: "list", value: hasSubject.concat({ topic: "", type, isRequired: 1, info: [], remark: 0 }) }
			])
			type === 1 ? setDan(dan => dan + 1) : type === 2 ? setDuo(duo => duo + 1) : setWenda(wenda => wenda + 1)
		},
		[form]
	)
	const addAnsItem = useCallback(
		(subjectIndex: number) => () => {
			const hasSubject: subjectItem[] = form.getFieldValue("list") || []
			hasSubject[subjectIndex].info = hasSubject[subjectIndex].info.concat({
				choice: letters[hasSubject[subjectIndex].info.length],
				content: ""
			})
			form.setFields([{ name: "list", value: hasSubject }])
		},
		[form]
	)
	return (
		done && (
			<Card
				style={{ width: 1000 }}
				extra={
					<Space>
						<Button type="text" onClick={closeModal}>
							<CloseOutlined />
						</Button>
					</Space>
				}
			>
				<Form layout="horizontal" form={form} onFinish={onFinish} preserve>
					<Form.Item
						name="name"
						initialValue="行业问卷"
						label="问卷名称："
						labelCol={{ span: 4 }}
						wrapperCol={{ span: 16 }}
						rules={[{ message: "最多30个汉字" }]}
					>
						<Input.TextArea showCount maxLength={30} autoSize disabled={status === 1}></Input.TextArea>
					</Form.Item>
					<div style={{ marginBottom: "20px" }}>
						<Space>
							<Button onClick={addSubject(1)} disabled={status === 1}>
								+ 单选
							</Button>
							<Button onClick={addSubject(2)} disabled={status === 1}>
								+ 多选
							</Button>
							<Button onClick={addSubject(3)} disabled={status === 1}>
								+ 问答题
							</Button>
						</Space>
						<br />
						<Space style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
							<div style={{ width: "250px", display: "flex", justifyContent: "space-around" }}>
								<div>{`${dan}题`}</div>
								<div>{`${duo}题`}</div>
								<div>{`${wenda}题`}</div>
							</div>

							<div style={{ marginRight: "50px" }}>{`合计：${dan + duo + wenda}题`}</div>
						</Space>
					</div>
					<Form.List name="list">
						{(list, { add, move, remove: qusRemove }) => (
							<SortItem onEnd={sortChange(move)} handle=".hand">
								{list.map(subject => (
									<div data-id={subject.name} key={subject.fieldKey} className="wrapperInvest">
										<Row className="topic-row">
											<Col span={17} style={{ height: "40px" }}>
												<Form.Item name={[subject.name, "topic"]} label={`${subject.name + 1}、`} colon={false}>
													<Input placeholder="请编辑问题" style={{ border: "none" }} disabled={status === 1}></Input>
												</Form.Item>
											</Col>
											<Col span={2} style={{ textAlign: "right", paddingTop: "3px", height: "40px" }}>
												{["", "单选", "多选", "问答题"][form.getFieldValue("list")[subject.name].type]}
											</Col>
											<Col span={2} style={{ textAlign: "center", height: "40px" }}>
												{form.getFieldValue("list")[subject.name].type !== 3 ? (
													<PlusCircleOutlined
														onClick={addAnsItem(subject.name)}
														title="增加选项"
														style={{ paddingTop: "12px" }}
													/>
												) : (
													<Form.Item
														name={[subject.name, "remark"]}
														normalize={value => {
															return Number(value)
														}}
														valuePropName="checked"
													>
														<Switch
															checkedChildren="单行"
															unCheckedChildren="多行"
															defaultChecked
															size="small"
															title="答案输入框类型"
														/>
													</Form.Item>
												)}
											</Col>

											<Col span={2} style={{ textAlign: "left", paddingTop: "8px", height: "40px" }}>
												{form.getFieldValue("list")[subject.name].type === 1 ? (
													<DeleteOutlined
														onClick={() => {
															qusRemove(subject.name)
															setDan(dan => dan - 1)
														}}
													/>
												) : form.getFieldValue("list")[subject.name].type === 2 ? (
													<DeleteOutlined
														onClick={() => {
															qusRemove(subject.name)
															setDuo(duo => duo - 1)
														}}
													/>
												) : (
													<DeleteOutlined
														onClick={() => {
															qusRemove(subject.name)
															setWenda(wenda => wenda - 1)
														}}
													/>
												)}
											</Col>
										</Row>
										{form.getFieldValue("list")[subject.name].type !== 3 ? (
											<Form.List name={[subject.name, "info"]}>
												{(info, { remove: ansRemove }) => (
													<>
														{info.map(answer => (
															<Row key={answer.key}>
																<Col span={1}></Col>
																<Col span={1} className="choice">
																	<Form.Item name={[answer.name, "choice"]} initialValue={letters[answer.name]} noStyle>
																		<>{`${letters[answer.name]}、`}</>
																	</Form.Item>
																</Col>
																<Col span={20} style={{ height: "40px", padding: "4px 5px" }}>
																	<Form.Item name={[answer.name, "content"]}>
																		<Input
																			style={{ border: "none" }}
																			placeholder="请编辑选项"
																			disabled={status === 1}
																		></Input>
																	</Form.Item>
																</Col>
																<Col span={1} style={{ textAlign: "center", lineHeight: "40px" }}>
																	<MinusCircleOutlined onClick={() => ansRemove(answer.name)} />
																</Col>
															</Row>
														))}
													</>
												)}
											</Form.List>
										) : null}
										<Row style={{ marginBottom: "20px" }}>
											<Col span={19} className="hand">
												<DragOutlined />
											</Col>
											<Col span={2} style={{ height: "40px", paddingTop: "6px" }}>
												是否必填
											</Col>
											<Col span={2} style={{ height: "40px" }}>
												<Form.Item
													name={[subject.name, "isRequired"]}
													normalize={value => Number(value)}
													valuePropName="checked"
												>
													<Switch defaultChecked></Switch>
												</Form.Item>
											</Col>
										</Row>
									</div>
								))}
							</SortItem>
						)}
					</Form.List>
					<Row justify="space-around">
						<Col span={19}></Col>
						<Col span={5}>
							<Button type="primary" htmlType="submit">
								保存
							</Button>
							<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
								取消
							</Button>
						</Col>
					</Row>
				</Form>
			</Card>
		)
	)
}

export default AddInvestigationModal
