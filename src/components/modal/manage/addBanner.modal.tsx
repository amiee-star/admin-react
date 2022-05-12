import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import limitNumber from "@/utils/checkNum.func"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"

interface Props {
	id: number
}
let mark = true
const AddBannerModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		if (!!data.url) {
			const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/
			if (!reg.test(data.url)) {
				message.error("链接地址请以http或https开头")
				return false
			}
		}
		if (!mark) return
		mark = false
		const params = !!id
			? {
					...data,
					image: data.image[0].fileSaveUrl,
					tinyImage: data.tinyImage[0].fileSaveUrl,
					imageMobile: data.imageMobile[0].fileSaveUrl,
					exhibitionId,
					id
			  }
			: {
					...data,
					image: data.image[0].fileSaveUrl,
					tinyImage: data.tinyImage[0].fileSaveUrl,
					imageMobile: data.imageMobile[0].fileSaveUrl,
					exhibitionId
			  }
		serviceManage[!!id ? "updateExhibitionBanner" : "addExhibitionBanner"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doBannerList")
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
		if (id) {
			serviceManage.getExhibitionBannerList({ id: props.id, exhibitionId }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data.entities[0],
						image: formatFile(res.data.entities[0].image),
						tinyImage: res.data.entities[0].tinyImage ? formatFile(res.data.entities[0].tinyImage) : null,
						imageMobile: formatFile(res.data.entities[0].imageMobile)
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
				style={{ width: 600 }}
				title={!props.id ? "新增Banner" : "编辑Banner"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 7 }}
					wrapperCol={{ span: 16 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					<Form.Item
						label="PC端Banner(大尺寸)："
						name="image"
						extra="文件大小5M之内，分辨率1922*588jpg、png"
						rules={[{ required: true, message: "请上传PC端大尺寸Banner图" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 5, [1922, 588])}
							checkType={"hotImage"}
							size={1}
						></FormUploads>
					</Form.Item>
					<Form.Item
						label="PC端Banner(小尺寸)："
						name="tinyImage"
						extra="文件大小5M之内，分辨率642*475jpg、png"
						rules={[{ required: true, message: "请上传PC端小尺寸Banner图" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 5, [642, 475])}
							checkType={"hotImage"}
							size={1}
						></FormUploads>
					</Form.Item>
					<Form.Item
						label="手机端Banner："
						name="imageMobile"
						extra="文件大小2M之内，分辨率750*422jpg、png"
						rules={[{ required: true, message: "请上传手机端Banner图" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 2)}
							checkType={"hotImage"}
							size={1}
							imgAction={{ crop: true, aspectRatio: [750, 422] }}
						></FormUploads>
					</Form.Item>
					<Form.Item label="名称：" name="title">
						<Input placeholder="请输入产品名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="跳转链接：" name="url">
						<Input placeholder="请输入跳转链接" />
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

export default AddBannerModel
