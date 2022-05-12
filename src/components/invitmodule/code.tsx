import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"

interface CodeProps {}
const Code: React.FC<CodeProps> = props => {
	const {} = props
	return (
		<>
			<Form.Item label="说明: " name="codeurl" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
				<Input maxLength={20} placeholder="请输入说明，最多20个字" />
			</Form.Item>
			<Form.Item label="二维码" name="codeimg" labelCol={{ span: 2 }}>
				<FormUploads accept="image/*" imgAction={{ crop: true }} />
			</Form.Item>
		</>
	)
}

export default Code
