import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"
import ImgList from "./imgList"

interface BoothProps {}
const Booth: React.FC<BoothProps> = props => {
	const {} = props

	return (
		<>
			<Form.List name="booth">
      {(fields, action) => <ImgList fields={fields} action={action}  />}
			</Form.List>
		</>
	)
}

export default Booth
