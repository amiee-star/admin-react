import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import limitNumber from "@/utils/checkNum.func"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"

interface Props {
	type: number
}
let mark = true
const OtherBannerModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, type } = props
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const [hasData, setHasData] = useState<boolean>(false)
	const id = useRef(null)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/
	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			const params = {
				...data,
				image: data.image[0].fileSaveUrl,
				exhibitionId,
				type,
				id: id.current
			}

			serviceManage[hasData ? "updateExhibitionBanner" : "addExhibitionBanner"](params)
				.then(res => {
					if (res.code === 200) {
						modalRef.current.destroy()
						message.success(hasData ? "修改成功" : "新增成功")
						form.resetFields()
					} else {
						message.error(res.msg)
					}
				})
				.finally(() => {
					mark = true
				})
		},
		[hasData]
	)
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
	useEffect(() => {
		serviceManage.getOtherBanner({ type: props.type, exhibitionId }).then(res => {
			if (res.code === 200) {
				if (res.data.length) {
					form.setFieldsValue({
						...res.data[0],
						image: formatFile(res.data[0].image)
					})
					setHasData(true)
					id.current = res.data[0].id
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
				style={{ width: 550 }}
				title={props.type == 1 ? "聚焦精彩Banner" : "新闻资讯Banner"}
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
					<Form.Item
						label="PC端Banner："
						name="image"
						extra="文件大小5M之内，分辨率1920*240jpg、png"
						rules={[{ required: true, message: "请上传PC端Banner图" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 5, [1920, 240])}
							checkType={"hotImage"}
							size={1}
						></FormUploads>
					</Form.Item>
					<Form.Item label="跳转链接：" name="url" rules={[{ message: "链接地址请以http或https开头", pattern: reg }]}>
						<Input placeholder="请输入跳转链接" />
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

export default OtherBannerModel
