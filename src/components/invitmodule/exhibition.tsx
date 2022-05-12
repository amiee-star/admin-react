import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"

interface ExhibitionProps {}
const Exhibition: React.FC<ExhibitionProps> = props => {
	const {} = props

	return (
		<>
			<Form.Item label="展馆导示图" name="exhibitionImg" extra="文件大小2M之内，jpg、png、gif图">
				<FormUploads
					accept="image/*"
					customCheck={checkImage("image", 2)}
					checkType={"image"}
					// imgAction={{ crop: true }}
					// imgAction={{ crop: true, aspectRatio: [800, 452] }}
					size={9999}
				/>
			</Form.Item>
		</>
	)
}

export default Exhibition
