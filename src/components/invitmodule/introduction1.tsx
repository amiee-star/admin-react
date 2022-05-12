import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Form, Input, Space } from "antd"
import React, { useCallback, useEffect, useState } from "react"

import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import SortItem from "@/components/utils/sort.item"
import TextArea from "antd/lib/input/TextArea"
import checkImage from "@/utils/checkImage.func"
import FormEditor from "../form/form.editor"

interface Introduction1Props {}
const Introduction1: React.FC<Introduction1Props> = props => {
	return (
		<>
			<Form.Item label="主标题" name="mainTitle" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
				<Input.TextArea maxLength={200} placeholder="请控好当内容长度, 需要换行展示请按回车键" />
			</Form.Item>
			<Form.Item label="副标题" name="subTitle" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
				<Input.TextArea maxLength={200} placeholder="请控制好内容长度, 需要换行展示请按回车键" />
			</Form.Item>
			<Form.Item label="时间地点" name="timePlace" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
				<Input maxLength={18} />
			</Form.Item>
			<Form.Item label="活动简介" name="atctiveIntroduction" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
				<TextArea showCount maxLength={200} />
			</Form.Item>

			<Form.Item label="logo图片" name="logo" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
				<FormUploads accept=".png, .jpg, .jpeg" checkType="hotImage" imgAction={{ crop: true }} />
			</Form.Item>
			<Form.Item label="模板背景音" name="backAudio" labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
				<FormUploads accept="audio/*" />
			</Form.Item>
		</>
	)
}

export default Introduction1
