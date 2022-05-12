import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"
import ImgListGuests from "./imgListGuests"

interface Guests1Props {}
const Guests1: React.FC<Guests1Props> = props => {
	const {} = props

	return (
		<Form.List name="guests">
			{(fields, action) => <ImgListGuests fields={fields} action={action} cutSize={[178, 269]} />}
		</Form.List>
	)
}

export default Guests1
