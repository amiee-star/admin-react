import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React from "react"

import ImgListGuides from "./imgListGuides"

interface Guide1Props {}
const Guide1: React.FC<Guide1Props> = props => {
	const {} = props

	return (
		<>
			<Form.List name="guide">
				{(fields, action) => <ImgListGuides fields={fields} action={action} cutSize={[470, 286.5]} />}
			</Form.List>
		</>
	)
}

export default Guide1
