import { DragOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback } from "react"
import checkImage from "@/utils/checkImage.func"
import FormUploads from "@/components/form/form.uploads"
import Sortable from "sortablejs"
import SortItem from "@/components/utils/sort.item"
import "./imgListGuests.less"
import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"
import TextArea from "antd/lib/input/TextArea"

interface VideoListProps {
	fields: FormListFieldData[]
	action: FormListOperation
	cutSize?: number[]
}
const ImgListGuests: React.FC<VideoListProps> = props => {
	const { fields, action, cutSize = [796, 448] } = props
	const sortChange = useCallback(
		(moveFunc: any) => (e: Sortable.SortableEvent) => {
			const { oldIndex, newIndex } = e
			moveFunc(oldIndex, newIndex)
		},
		[]
	)
	const removeItem = useCallback(
		(index: number) => () => {
			action.remove(index)
		},
		[fields, action]
	)
	const addItem = useCallback(() => {
		action.add()
	}, [action])

	return (
		<>
			<SortItem onEnd={sortChange(action.move)} handle=".hand">
				{fields.map(field => (
					<div key={field.key} className="wrappergt">
						<div className="hand">
							<DragOutlined style={{ fontSize: 48 }} />
						</div>
						<Form.Item
							name={[field.name, "img"]}
							fieldKey={[field.fieldKey, "img"]}
							style={{ marginLeft: "10px", marginBottom: "0px" }}
							rules={[{ required: true, message: "请上传图片" }]}
						>
							<FormUploads
								accept="image/*"
								customCheck={checkImage("image", 2)}
								checkType={"image"}
								imgAction={{ crop: true, aspectRatio: cutSize }}
								size={1}
							></FormUploads>
						</Form.Item>
						<Form.Item
							label="标题"
							name={[field.name, "title"]}
							fieldKey={[field.fieldKey, "title"]}
							// rules={[{ required: true }]}
							style={{ alignSelf: "flex-start", margin: "0 0 5px 10px" }}
						>
							<Input placeholder="最多15个字" maxLength={15}></Input>
						</Form.Item>
						<Form.Item
							label="内容"
							name={[field.name, "content"]}
							fieldKey={[field.fieldKey, "content"]}
							// rules={[{ required: true }]}
							style={{ alignSelf: "flex-start", margin: "0 0 5px 10px", width: "230px" }}
						>
							<TextArea placeholder="最多110个字" maxLength={110} />
						</Form.Item>
						<MinusCircleOutlined onClick={removeItem(field.name)} className="circlesgt" />
					</div>
				))}
			</SortItem>
			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />}>
					新增
				</Button>
			</Form.Item>
		</>
	)
}

export default ImgListGuests
