import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"
import "./display.less"
interface DisplayProps {}
const Display: React.FC<DisplayProps> = props => {
	const {} = props

	return (
		<>
			<Form.List name="display">
				{(fields, { add, remove }) => (
					<>
						{fields.map((field, index) => (
							<Space key={field.key} align="baseline" direction="horizontal">
								<Form.Item
									{...field}
									label={`内容${index}`}
									name={[field.name, "content"]}
									fieldKey={[field.fieldKey, "content"]}
									style={{ width: "588px" }}
								>
									<Input maxLength={15} />
								</Form.Item>

								<MinusCircleOutlined onClick={() => remove(field.name)} />
							</Space>
						))}

						<Form.Item>
							<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
								新增内容
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		</>
	)
}

export default Display
