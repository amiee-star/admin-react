import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Radio, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import limitNumber from "@/utils/checkNum.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import TextArea from "antd/lib/input/TextArea"
import serviceData from "@/services/service.data"

interface Props {
	id: number
}

export interface ExhibitionMenusItem {
	createDate: string
	exhibitionId: number
	id: number
	isDel: number
	link: string
	menubarId: number
	title: string
	updateDate: string
	url: string
	state: number
}

const ysConfigureModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const { Option } = Select
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [ids, setIds] = useState(Number)
	const [tradeClassOne, setTradeClassOne] = useState([])
	const [value, setValue] = React.useState(null)

	const onChange = (e: any) => {
		setValue(e.target.value)
	}
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceManage.yxgethangye({ exhibitionId: exhibitionId }).then(res => {
			if (res.code === 200 && res.data) {
				let arr: ExhibitionMenusItem[] = []
				res.data.map(item => {
					if (item.state === 1) {
						arr.push(item)
					}
				})
				setTradeClassOne(arr)
			} else {
				message.error(res.msg)
			}
		})
	}, [])

	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			let imageUrl = ""
			if (!!data.image && !!data.image[0]) {
				imageUrl = data.image[0].fileSaveUrl
			}
			const params = {
				id: ids,
				type: data.type,
				title: data.title,
				introduction: data.introduction,
				img: imageUrl,
				industryId: data.industryId,
				exhibitionId
			}
			console.log(params)
			serviceManage
				.yxsetyunshang(params)
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
		[ids]
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
		serviceManage.yxgetyunshang({ exhibitionId }).then(res => {
			console.log(res)
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data,
					image: res.data.img ? formatFile(res.data.img) : null
				})
				setDone(true)
				setIds(res.data.id)
				setValue(res.data.type)
			} else {
				message.error(res.msg)
			}
		})
	}, [])

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
					<Form.Item
						label="标题:"
						name="title"
						rules={[
							{ required: true, message: "请输入标题" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input maxLength={20} placeholder="请输入标题名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="简介：" name="introduction" rules={[{ required: true }]}>
						<TextArea showCount maxLength={100} />
					</Form.Item>
					<Form.Item label="封面图：" name="image" extra="大小在2M以内,分辨率为670*426">
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 2)}
							checkType={"hotImage"}
							imgAction={{ crop: true, aspectRatio: [670, 426] }}
						></FormUploads>
					</Form.Item>
					<Form.Item name="type" label="跳转连接指向:" rules={[{ required: true }]}>
						<Radio.Group onChange={onChange} value={value} defaultValue={1}>
							<Radio value={1}>3D导览岛</Radio>
							<Radio value={2}>2.5D导览页</Radio>
						</Radio.Group>
					</Form.Item>
					{value != 2 ? (
						""
					) : (
						<Form.Item label="2.5D行业选择" name="industryId" rules={[{ required: true, message: "请选择行业" }]}>
							<Select placeholder={"请选择行业"}>
								{tradeClassOne.map(item => (
									<Option key={item.industryId} value={item.industryId}>
										{item.industryName}
									</Option>
								))}
							</Select>
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

export default ysConfigureModal
