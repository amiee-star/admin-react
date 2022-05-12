import { DragOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, message, Row, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"
import Sortable from "sortablejs"
import "./highlights1.less"

interface Highlights1Props {}
const Highlights1: React.FC<Highlights1Props> = props => {
	const {} = props

	const addHighlights = useCallback(
		(fields, add) => () => {
			if (fields.length < 3) {
				for (let i = fields.length; i < 3; i++) {
					add()
				}
			} else if (fields.length < 5) {
				add()
			} else {
				message.error("活动亮点请控制在3-5条之间")
			}
		},
		[]
	)
	const sortChange = useCallback(
		(moveFunc: any) => (e: Sortable.SortableEvent) => {
			const { oldIndex, newIndex } = e
			moveFunc(oldIndex, newIndex)
		},
		[]
	)
	return (
		<>
			<Form.List name="highlights">
				{(fields, { add, move, remove }) => (
					<>
						<SortItem onEnd={sortChange(move)} handle=".handdee">
							{fields.map(field => (
								<div key={field.key} className="wrapperhl">
									<div className="handdee">
										<DragOutlined style={{ fontSize: 32 }} />
									</div>
									<Form.Item
										{...field}
										label="标题"
										name={[field.name, "title"]}
										fieldKey={[field.fieldKey, "title"]}
										style={{ width: "180px", margin: "0 10px 5px 10px", alignSelf: "flex-start" }}
									>
										<Input maxLength={6} placeholder="最多6个字"></Input>
									</Form.Item>
									<Form.Item
										{...field}
										label="内容"
										name={[field.name, "content"]}
										fieldKey={[field.fieldKey, "content"]}
										style={{ width: "400px", marginBottom: "5px" }}
									>
										<TextArea placeholder="最多120个字" maxLength={120} />
									</Form.Item>

									<MinusCircleOutlined onClick={() => remove(field.name)} className="circleshl" />
								</div>
							))}
						</SortItem>
						<Form.Item>
							<Button type="dashed" onClick={addHighlights(fields, add)} block icon={<PlusOutlined />}>
								新增
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		</>
	)
}

export default Highlights1
