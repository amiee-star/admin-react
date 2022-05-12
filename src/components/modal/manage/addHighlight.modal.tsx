import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message } from "antd"
import limitNumber from "@/utils/checkNum.func"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import checkVideo from "@/utils/checkVideo.func"

import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"

interface Props {
	id: string
}
const AddHighlightModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	let mark = true

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const formatFile = (url: any) => {
		if (url instanceof Array) {
			const arr: { filePreviewUrl: string; fileSaveUrl: string; fileSize: number }[] = []
			url.forEach(item => {
				arr.push({
					filePreviewUrl: `${urlFunc.replaceUrl(item.url, "imageUrl")}`,
					fileSaveUrl: item.url,
					fileSize: 0
				})
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: `${urlFunc.replaceUrl(url, "imageUrl")}`,
					fileSaveUrl: url,
					fileSize: 0
				}
			]
		}
	}

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const params = !!id
			? {
					...data,
					image: data.image[0].fileSaveUrl,
					url: data.url[0].fileSaveUrl,
					exhibitionId,
					id
			  }
			: {
					...data,
					image: data.image[0].fileSaveUrl,
					url: data.url[0].fileSaveUrl,
					exhibitionId
			  }
		serviceManage[!!id ? "updataHighlight" : "addHighlight"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doHighlighList")
					modalRef.current.destroy()
					message.success(id ? "修改成功" : "新增成功")
					form.resetFields()
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])

	useEffect(() => {
		if (id) {
			serviceManage.getHighlightList({ id: props.id, exhibitionId }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data.entities[0],
						image: formatFile(res.data.entities[0].image),
						url: formatFile(res.data.entities[0].url)
					})
					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			setDone(true)
		}
	}, [])
	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={props.id == "" ? "新增精彩片段" : "编辑精彩片段"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 5 }}
					wrapperCol={{ span: 19 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					<Form.Item label="视频名称：" name="title" rules={[{ required: true, message: "请输入视频名称" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="排序：" name="sort" rules={[{ required: true, message: "请输入序号" }]}>
						<InputNumber
							style={{ width: 200 }}
							max={9999}
							min={0}
							step={1}
							formatter={limitNumber}
							parser={limitNumber}
							placeholder="请输入正整数"
						/>
					</Form.Item>
					<Form.Item
						label="上传视频"
						name="url"
						extra="支持300MB以内的mp4文件，建议H.264编码，分辨率720P，帧数不高于25fps，码率不超过5Mbps"
						rules={[{ required: true, message: "请上传视频" }]}
					>
						<FormUploads
							baseUrl="imageUrl"
							accept="video/*"
							customCheck={checkVideo("video", 300)}
							checkType={"video"}
						/>
					</Form.Item>

					<Form.Item
						label="上传封面图："
						extra="请选择视频文件截图保存"
						name="image"
						rules={[{ required: true, message: "请上传封面图" }]}
					>
						<FormUploads
							baseUrl="imageUrl"
							accept="video/*"
							customCheck={checkImage("image", 5)}
							checkType={"video"}
							imgAction={{ crop: false, videoCover: true, aspectRatio: [796, 448], multiple: 3 }}
						></FormUploads>
					</Form.Item>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</Form>
			</Card>
		)
	)
}

export default AddHighlightModal
