import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Radio } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import limitNumber from "@/utils/checkNum.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import TextArea from "antd/lib/input/TextArea"

interface Props {
	id: number
}

const wxConfigureModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [ids, setIds] = useState(Number)
	const [flag, setFlag] = useState("")
	const [isDefault, setIsDefault] = useState(null)
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			console.log(data)
			let imageUrl = ""
			if (!!data.image && !!data.image[0]) {
				imageUrl = data.image[0].fileSaveUrl
			}
			const params = {
				id: ids,
				title: isDefault ? "" : data.title,
				introduction: isDefault ? "" : data.introduction,
				img: isDefault ? "" : imageUrl,
				isDefault: isDefault,
				flag: flag,
				exhibitionId
			}

			serviceManage
				.setMoRenWxShare(params)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doExhibitionPicList")
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
		},
		[ids, flag, isDefault]
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
		if (id) {
			serviceManage.setMoRenWxShareById({ id: props.id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data,
						image: res.data.img ? formatFile(res.data.img || "") : null
					})
					setDone(true)
					setIds(res.data.id)
					setFlag(res.data.flag)
					setIsDefault(res.data.isDefault)
					setValue(res.data.isDefault)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			serviceManage.getMoRenWxShare({ exhibitionId }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data,
						image: res.data.img ? formatFile(res.data.img || "") : null
					})
					setDone(true)
					setIds(res.data.id)
					setFlag(res.data.flag)
					setIsDefault(res.data.isDefault)
					setValue(res.data.isDefault)
				} else {
					message.error(res.msg)
				}
			})
		}
	}, [])
	const [value, setValue] = React.useState(null)

	const onChange = (e: any) => {
		setValue(e.target.value)
		setIsDefault(e.target.value)
	}
	return (
		done && (
			<Card
				style={{ width: 580 }}
				title="编辑"
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
				>
					{!id ? (
						""
					) : (
						<Form.Item name="isDefault" label="配置方式:" rules={[{ required: true }]}>
							{console.log()}
							<Radio.Group onChange={onChange} value={value} defaultValue={isDefault}>
								<Radio value={1}>默认配置</Radio>
								<Radio value={0}>自定义配置</Radio>
							</Radio.Group>
						</Form.Item>
					)}
					{value == 1 ? (
						""
					) : (
						<Form.Item
							label="微信分享标题:"
							name="title"
							rules={[
								{ required: true, message: "请输入标题" },
								{ message: "请输入1-30个文字", max: 30 }
							]}
						>
							<Input placeholder="请输入标题名称（最多30个字符）" />
						</Form.Item>
					)}
					{value == 1 ? (
						""
					) : (
						<Form.Item label="微信分享简述：" name="introduction" rules={[{ required: true }]}>
							<TextArea showCount maxLength={38} />
						</Form.Item>
					)}
					{value == 1 ? (
						""
					) : (
						<Form.Item label="产品封面图：" name="image" extra="建议使用300*300大小的图片">
							<FormUploads
								accept=".png, .jpg, .jpeg"
								customCheck={checkImage("image", 2)}
								checkType={"hotImage"}
								imgAction={{ crop: true, aspectRatio: [300, 300] }}
							></FormUploads>
						</Form.Item>
					)}

					<Form.Item style={{ textAlign: "center" }}>
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

export default wxConfigureModal
