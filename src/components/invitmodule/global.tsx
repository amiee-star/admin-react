import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"

interface GlobalProps {}
const Global: React.FC<GlobalProps> = props => {
	const {} = props
	return (
		<>
			<Form.Item label="标签图片" name="labelPic" extra="文件大小2M以内, jpg, png, gif图">
				<FormUploads accept=".png, .jpg, .jpeg" checkType="hotImage" imgAction={{ crop: true }} />
			</Form.Item>
		</>
	)
}

export default Global
