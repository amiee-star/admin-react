import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import serviceManage from "@/services/service.manage"
import FormUploads from "@/components/form/form.uploads"
import urlFunc from "@/utils/url.func"
import checkVideo from "@/utils/checkVideo.func"

interface Props {}
const EditStartVideoModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [size, setsize] = useState<number>()
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		console.log("data", data)

		const params = {
			size: data.url.length ? data.url[0].fileSize : 0,
			url: data.url.length ? data.url[0].fileSaveUrl : ""
		}
		serviceManage
			.saveStartVideo(params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doStartVideo")
					modalRef.current.destroy()
					message.success("修改成功")
					form.resetFields()
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])
	const formatFile = (url: any, size: number) => {
		if (url instanceof Array) {
			const arr: { filePreviewUrl: string; fileSaveUrl: string; fileSize: number }[] = []
			url.forEach(item => {
				arr.push({
					filePreviewUrl: `${urlFunc.replaceUrl(item.url, "imageUrl")}`,
					fileSaveUrl: item.url,
					fileSize: size
				})
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: `${urlFunc.replaceUrl(url, "imageUrl")}`,
					fileSaveUrl: url,
					fileSize: size
				}
			]
		}
	}
	useEffect(() => {
		serviceManage.getStartVideo().then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					url: res.data[0].url ? formatFile(res.data[0].url, res.data[0].size) : ""
				})
				setsize(res.data[0].size || 0)
				setDone(true)
			} else {
				message.error(res.msg)
			}
		})
	}, [])
	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={"编辑开场视频"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false} onFinish={onFinish}>
					<Form.Item
						label="上传视频"
						name="url"
						extra="视频分辨率为：1920*1080；支持15MB以内的mp4文件，建议H.264编码，帧数不高于25fps，码率不超过5Mbps"
					>
						<FormUploads
							baseUrl="imageUrl"
							accept="video/*"
							customCheck={checkVideo("video", 300)}
							checkType={"video"}
						/>
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

export default EditStartVideoModal
