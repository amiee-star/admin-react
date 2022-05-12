import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message, InputNumber } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import { DatePicker } from "antd"
import moment from "moment"
import checkImage from "@/utils/checkImage.func"
import FormUploads from "@/components/form/form.uploads"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import limitNumber from "@/utils/checkNum.func"

const { RangePicker } = DatePicker

interface Props {
	id: string
}
const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)/
const AddFlowpathModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		let imageUrl = ""
		if (!!data.image && data.image[0]) {
			imageUrl = data.image[0].fileSaveUrl
		}
		const params = !!id
			? {
					...data,
					image: imageUrl,
					exhibitionId,
					id
			  }
			: {
					...data,
					image: imageUrl,
					exhibitionId
			  }
		serviceManage[!!id ? "updataFlowpath" : "addFlowpath"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doFlowpathList")
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
	const [dates, setDates] = useState([])
	const [hackValue, setHackValue] = useState()
	const [value, setValue] = useState()
	const disabledDate = (current: any) => {
		if (!dates || dates.length === 0) {
			return false
		}
		const tooLate = dates[0] && current.diff(dates[0], "days") > 0
		const tooEarly = dates[1] && dates[1].diff(current, "days") > 0
		return tooEarly || tooLate
	}

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
	const onOpenChange = (open: any) => {
		if (open) {
			setHackValue([])
			setDates([])
		} else {
			setHackValue(undefined)
		}
	}

	useEffect(() => {
		if (id) {
			serviceManage.getFlowpathList({ id, exhibitionId }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data.entities[0],
						image: !!res.data.entities[0].image ? formatFile(res.data.entities[0].image) : null
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
				title={props.id == "" ? "新增展会流程" : "编辑展会流程"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false} onFinish={onFinish}>
					<Form.Item label="议程时间：" name="time" rules={[{ required: true, message: "请输入议程时间" }]}>
						<Input maxLength={50} />
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

					<Form.Item label="议题：" name="content">
						<TextArea showCount maxLength={50} />
					</Form.Item>
					<Form.Item label="地点:" name="address" rules={[{ message: "请输入议会地点" }]}>
						<TextArea showCount maxLength={30} />
					</Form.Item>
					<Form.Item
						label="上传封面图："
						extra="文件大小5M之内，分辨率830*465jpg、png"
						name="image"
						rules={[{ required: true }]}
						labelCol={{ span: 5 }}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							customCheck={checkImage("image", 5)}
							checkType={"hotImage"}
							imgAction={{ crop: true, aspectRatio: [830, 465] }}
						></FormUploads>
					</Form.Item>
					<Form.Item
						label="跳转链接："
						name="linkUrl"
						rules={[{ message: "链接地址请以http或https开头", pattern: reg }]}
					>
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

export default AddFlowpathModal
