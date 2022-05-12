import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Row, Col } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import limitNumber from "@/utils/checkNum.func"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import Item from "antd/lib/list/Item"
import { previewInvitaion } from "@/interfaces/api.interface"
import Paragraph from "antd/lib/typography/Paragraph"
import TextArea from "antd/lib/input/TextArea"

interface Props {
	id: string
}
const ShareInvitationModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const [previewData, setPreviewData] = useState<previewInvitaion>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	let mark = true
	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const params = {
			...data,
			productCover: data.productCover && data.productCover.length > 0 ? data.productCover[0].fileSaveUrl : "",
			// exhibitionId,
			id
		}

		serviceManage
			.shareInvitaionUpdate(params)
			.then(res => {
				if (res.code === 200) {
					// eventBus.emit("doInvitation")
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

	const formatFile = (url: any) => {
		if (url instanceof Array) {
			const arr: { filePreviewUrl: string; fileSaveUrl: string; fileSize: number }[] = []
			url.forEach(item => {
				arr.push({
					filePreviewUrl: item,
					fileSaveUrl: item,
					fileSize: 0
				})
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: url,
					fileSaveUrl: url,
					fileSize: 0
				}
			]
		}
	}
	useEffect(() => {
		serviceManage.shareInvitaion({ id }).then(res => {
			if (res.code === 200) {
				if (res.data) {
					setPreviewData(res.data)
					form.setFieldsValue({
						...res.data,
						productCover: res.data.productCover ? formatFile(res.data.productCover) : null
					})
				}
				setDone(true)
			} else {
				message.error(res.msg)
			}
		})
	}, [])
	return (
		done && (
			<Card
				style={{ width: 750 }}
				title="分享"
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				{" "}
				<div style={{ display: "flex" }}>
					<div>线上地址： </div>
					{/* <div>{previewData.url}</div> */}
					<Paragraph copyable={{ tooltips: false }}>{previewData.url}</Paragraph>
				</div>
				<div style={{ display: "flex" }}>
					<div>线上二维码：</div>
					<img
						src={`${urlFunc.getHost("imageUrl")}/${previewData.qrCode}`}
						style={{ display: "block", width: "100px", height: "100px" }}
					/>
				</div>
				<Form
					layout="horizontal"
					labelCol={{ span: 5 }}
					wrapperCol={{ span: 19 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					<Form.Item label="微信分享标题:" name="wechatTitle" rules={[{ required: true, message: "请输入标题名称" }]}>
						<Input placeholder="请输入标题名称（最多30个字符）" maxLength={30} />
					</Form.Item>
					<Form.Item label="微信分享简述:" name="wechatContent" rules={[{ required: true, message: "请输入名称" }]}>
						<TextArea showCount maxLength={38} />
					</Form.Item>
					<Form.Item label="产品封面图：" extra="建议使用300*300分辨率的图片" name="productCover">
						<FormUploads
							baseUrl="imageUrl"
							accept="image/*"
							customCheck={checkImage("image", 5)}
							checkType={"image"}
							imgAction={{ crop: true, aspectRatio: [300, 300] }}
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

export default ShareInvitationModel
