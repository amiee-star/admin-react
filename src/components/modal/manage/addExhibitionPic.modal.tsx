import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import limitNumber from "@/utils/checkNum.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"

interface Props {
	id: string
}

const AddExhibitionPicModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const params = !!id
			? {
					...data,
					image: data.image[0].fileSaveUrl,
					exhibitionId,
					id
			  }
			: {
					...data,
					image: data.image[0].fileSaveUrl,
					exhibitionId
			  }
		serviceManage[!!id ? "updateExhibitionPic" : "addExhibitionPic"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doExhibitionPicList")
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
			serviceManage.getExhibitionPicList({ id: props.id, exhibitionId }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data.entities[0],
						image: formatFile(res.data.entities[0].image)
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
				title={id ? "编辑展会图片" : "新增展会图片"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 4 }}
					wrapperCol={{ span: 19 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					<Form.Item
						label="照片名称："
						name="title"
						rules={[
							{ required: true, message: "请输入照片名称" }
							// { message: "请输入1-20个文字", max: 20 }
						]}
					>
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
					<Form.Item label="描述：" name="content">
						<Input />
					</Form.Item>
					<Form.Item
						label="上传照片："
						extra="支持5M以内 PNG,JPG图片"
						name="image"
						rules={[{ required: true, message: "请上传图片" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 5)}
							checkType={"hotImage"}
							size={1}
							imgAction={{ crop: true, aspectRatio: [590, 332] }}
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

export default AddExhibitionPicModal
