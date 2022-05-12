import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"

interface AgendaProps {}
const Agenda: React.FC<AgendaProps> = props => {
	const {} = props

	return (
		<>
			<Form.List name="agenda">
				{(fields, { add, remove }) => (
					<>
						{fields.map(field => (
							<Space key={field.key} align="baseline">
								<Form.Item
									{...field}
									label="时间"
									name={[field.name, "time"]}
									fieldKey={[field.fieldKey, "time"]}
									style={{ width: "180px" }}
								>
									<Input></Input>
								</Form.Item>
								<Form.Item
									{...field}
									label="内容"
									name={[field.name, "content"]}
									fieldKey={[field.fieldKey, "content"]}
									style={{ width: "400px" }}
								>
									<Input />
								</Form.Item>

								<MinusCircleOutlined onClick={() => remove(field.name)} />
							</Space>
						))}

						<Form.Item>
							<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
								新增议程
							</Button>
						</Form.Item>
					</>
				)}
			</Form.List>
		</>
	)
}

export default Agenda
