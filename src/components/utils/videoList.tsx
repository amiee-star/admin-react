import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import "./addTradeInfo.modal.less"
import checkVideo from "@/utils/checkVideo.func"
import Sortable from "sortablejs"
import SortItem from "@/components/utils/sort.item"

import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"

interface VideoListProps {
	fields: FormListFieldData[]
	action: FormListOperation
	cutSize: number[]
}
const VideoList: React.FC<VideoListProps> = props => {
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
							extra="支持300MB以内的mp4文件，建议H.264编码，分辨率720P，帧数不高于25 fps，码率不超过5Mbps"
							rules={[{ required: true, message: "请上传视频" }]}
						>
							<FormUploads
								baseUrl="imageUrl"
								btnTxt="上传视频"
								accept="video/*"
								checkType={"video"}
								customCheck={checkVideo("video", 300)}
							/>
						</Form.Item>
						<Form.Item
							name={[field.name, "videoImg"]}
							fieldKey={[field.fieldKey, "videoImg"]}
							extra="封面照片分辨率796*448jpg、png"
							rules={[{ required: true, message: "请上传视频封面" }]}
						>
							<FormUploads
								baseUrl="imageUrl"
								btnTxt="视频封面"
								accept="video/*"
								checkType={"video"}
								imgAction={{ crop: true, videoCover: true, aspectRatio: cutSize }}
							/>
						</Form.Item>
						<MinusCircleOutlined onClick={removeItem(field.name)} />
					</Space>
				))}
			</SortItem>

			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />}>
					新增视频
				</Button>
			</Form.Item>
		</>
	)
}

export default VideoList
