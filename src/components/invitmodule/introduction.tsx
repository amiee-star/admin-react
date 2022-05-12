import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback, useEffect, useState } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"
import FormEditor from "../form/form.editor"

interface IntroductionProps {
	introductionDetail: string
}
const Introduction: React.FC<IntroductionProps> = props => {
	let i = 0
	const { introductionDetail } = props

	const [a, setA] = useState("")
	useEffect(() => {
		setTimeout(() => {
			setA(introductionDetail)
		}, 0)
	}, [])

	return (
		<>
			<Form.Item label="标题" name="introductionTitle">
				<Input maxLength={15} />
			</Form.Item>
			<Form.Item label="详情" name="introductionDetail">
				<FormEditor defaultContent={a} />
				{/* <TextArea showCount maxLength={150} /> */}
			</Form.Item>
			<Form.Item label="落款" name="introductionSign">
				<Input maxLength={15} />
			</Form.Item>
			<Form.Item label="日期" name="introductionDate">
				<Input />
			</Form.Item>
		</>
	)
}

export default Introduction
