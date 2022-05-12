import { Form, Input, Button, Space, Select, Row, Col, message } from "antd"
import { DragOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import React, { useCallback } from "react"
import SortItem from "@/components/utils/sort.item"
import Sortable from "sortablejs"
import "./agenda1.less"

const Agenda1 = () => {
	// 拖拽排序
	const sortChange = useCallback(
		(moveFunc: any) => (e: Sortable.SortableEvent) => {
			const { oldIndex, newIndex } = e
			moveFunc(oldIndex, newIndex)
		},
		[]
	)
	const addItem = useCallback(
		(func, fields) => () => {
			if (fields.length < 3) {
				func()
			} else {
				message.error("最多添加三个议程")
			}
		},
		[]
	)
	const addSubItem = useCallback(
		(func, fields) => () => {
			if (fields.length < 4) {
				func()
			} else {
				message.error("最多添加四条内容")
			}
		},
		[]
	)
	return (
		<Form.List name="agenda">
			{(fields, { add, move, remove }) => (
				<SortItem onEnd={sortChange(move)} handle=".hands">
					{fields.map(field => (
						<Row className="container" key={field.key}>
							<Col span={23}>
								<Form.Item label="标题" name={[field.name, "title"]} style={{ width: "100%", marginBottom: "5px" }}>
									<Input placeholder="最多12个字" maxLength={12}></Input>
								</Form.Item>
							</Col>
							<Col span={1}>
								<MinusCircleOutlined
									style={{ position: "absolute", left: "50%", top: "5px" }}
									onClick={() => remove(field.name)}
								/>
							</Col>
							<Col span={23}>
								<Form.List name={[field.name, "item"]}>
									{(fields, { add, remove }) => (
										<div key={field.key}>
											{fields.map(field => (
												<Row key={field.key} justify="center">
													<Col span={10}>
														<Form.Item label="内容" name={[field.name, "content"]} style={{ marginBottom: "5px" }}>
															<Input placeholder="最多15个字" maxLength={15}></Input>
														</Form.Item>
													</Col>
													<Col span={10}>
														<Form.Item
															label="人员"
															name={[field.name, "person"]}
															style={{ marginLeft: "15px", marginBottom: "5px" }}
														>
															<Input placeholder="最多10个字" maxLength={10} style={{ width: "100%" }}></Input>
														</Form.Item>
													</Col>
													<Col span={1}>
														<MinusCircleOutlined
															style={{ position: "absolute", left: "50%", top: "5px" }}
															onClick={() => remove(field.name)}
														/>
													</Col>
												</Row>
											))}
											<Row justify="center">
												<Col span={21}>
													<Button
														type="dashed"
														style={{ width: "100%" }}
														onClick={addSubItem(add, fields)}
														icon={<PlusOutlined />}
													>
														新增内容
													</Button>
												</Col>
											</Row>
										</div>
									)}
								</Form.List>
							</Col>
							<div className="hands">
								<DragOutlined style={{ color: "#cccccc" }} />
							</div>
						</Row>
					))}
					<Form.Item>
						<Button type="default" onClick={addItem(add, fields)} block icon={<PlusOutlined />}>
							新增议程
						</Button>
					</Form.Item>
				</SortItem>
			)}
		</Form.List>
	)
}

export default Agenda1
