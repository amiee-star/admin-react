import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"

interface Props {
	id: string
}
const AddPartnerModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	let mark = true
	const exhibitionId = location.search.split("exhibitionId=")[1]
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
					exhibitionId,
					id
			  }
			: {
					...data,
					image: data.image[0].fileSaveUrl,
					exhibitionId
			  }

		serviceManage[!!id ? "updataPartner" : "addPartner"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doPartnerList")
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
			serviceManage.getPartnerList({ id: props.id, exhibitionId }).then(res => {
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
	}, [id])
	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={props.id == "" ? "新增合作媒体" : "编辑合作媒体"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false} onFinish={onFinish}>
					<Form.Item
						label="媒体名称："
						name="title"
						rules={[
							{ required: true, message: "请输入媒体名称" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input placeholder="请输入媒体（最多20个字符）" />
					</Form.Item>
					<Form.Item label="排序：" name="sort" rules={[{ required: true, message: "请输入排序" }]}>
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
						label="媒体Logo："
						extra="支持200kb以内 PNG,JPG图片"
						name="image"
						rules={[{ required: true, message: "请上传媒体Logo图片" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 200 / 1024)}
							checkType={"hotImage"}
							imgAction={{ crop: true, aspectRatio: [180, 60] }}
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

export default AddPartnerModal
