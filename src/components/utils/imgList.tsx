import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Space } from "antd"
import React, { useCallback } from "react"
import checkImage from "@/utils/checkImage.func"
import FormUploads from "@/components/form/form.uploads"
import Sortable from "sortablejs"
import SortItem from "@/components/utils/sort.item"

import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"

interface VideoListProps {
	fields: FormListFieldData[]
	action: FormListOperation
	cutSize: number[]
}
const ImgList: React.FC<VideoListProps> = props => {
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
					<Space key={field.key} align="baseline" className="hand">
						<Form.Item
							name={[field.name, "url"]}
							fieldKey={[field.fieldKey, "url"]}
							extra="封面照片分辨率796*448jpg、png"
							rules={[{ required: true, message: "请上传图片" }]}
						>
							<FormUploads
								accept=".png, .jpg, .jpeg"
								customCheck={checkImage("image", 2)}
								checkType={"hotImage"}
								imgAction={{ crop: true, aspectRatio: cutSize }}
								size={1}
							></FormUploads>
						</Form.Item>
						<MinusCircleOutlined onClick={removeItem(field.name)} />
					</Space>
				))}
			</SortItem>

			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />}>
					新增图片
				</Button>
			</Form.Item>
		</>
	)
}

export default ImgList
