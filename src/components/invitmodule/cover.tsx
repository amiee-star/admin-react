import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"

interface CoverProps {}
const Cover: React.FC<CoverProps> = props => {
	const {} = props
	return (
		<>
			<Form.Item label="展会名称：" name="coverName">
				<TextArea showCount maxLength={39} autoSize={{ minRows: 3, maxRows: 5 }} />
			</Form.Item>
			<Form.Item label="模板背景音" name="coverAudio" extra="支持5MB以内的音频文件（mp3），建议码率不超过320kbps">
				<FormUploads accept="audio/*" />
			</Form.Item>
			<Form.Item label="logo图片" name="coverLogo" extra="文件大小2M以内, jpg, png, gif图">
				<FormUploads accept=".png, .jpg, .jpeg" checkType="hotImage" imgAction={{ crop: true }} />
			</Form.Item>
		</>
	)
}

export default Cover
