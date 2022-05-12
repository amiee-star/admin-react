import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import { DatePicker } from "antd"
import moment from "moment"
import serviceManage from "@/services/service.manage"

const { RangePicker } = DatePicker

interface Props {
	id: string
}
const UpdateExhibitionInfoModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	let mark = true
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [custom1, setCustom1] = useState<string>("")
	const [custom2, setCustom2] = useState<string>("")
	const [custom3, setCustom3] = useState<string>("")
	const [recommend, setRecommend] = useState<string>("")

	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false

			console.log(data)
			let arr = []
			for (let k in data) {
				let obj = { key: k, value: data[k] }
				switch (k) {
					case "custom1":
						obj["alias"] = custom1
						break
					case "custom2":
						obj["alias"] = custom2
						break
					case "custom3":
						obj["alias"] = custom3
						break
					case "recommend":
						obj["alias"] = recommend
						break
				}
				arr.push(obj)
			}
			serviceManage["exhibitionUpdateinfo"](arr)
				.then(res => {
					if (res.code === 200) {
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
		},
		[custom1, custom2, custom3, recommend]
	)

	useEffect(() => {
		if (id) {
			serviceManage.getExbitionInfo().then(res => {
				if (res.code === 200) {
					console.log(res)
					let fields = {}
					res.data.forEach(item => {
						fields[`${item.key}`] = item.value
						switch (item.key) {
							case "custom1":
								setCustom1(item.alias)
								break
							case "custom2":
								setCustom2(item.alias)
								break
							case "custom3":
								setCustom3(item.alias)
								break
							case "recommend":
								setRecommend(item.alias)
								break
						}
					})

					form.setFieldsValue({
						...fields
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

	console.log("sdjfdsf ", custom1, custom2, custom3, recommend)

	//修改字段名称
	const custom = useCallback(
		v => {
			if (v === "custom1")
				return (
					<Input
						value={custom1}
						onChange={e => {
							setCustom1(e.target.value)
						}}
					/>
				)
			if (v === "custom2")
				return (
					<Input
						value={custom2}
						onChange={e => {
							setCustom2(e.target.value)
						}}
					/>
				)
			if (v === "custom3")
				return (
					<Input
						value={custom3}
						onChange={e => {
							setCustom3(e.target.value)
						}}
					/>
				)
			if (v === "recommend")
				return (
					<Input
						value={recommend}
						onChange={e => {
							setRecommend(e.target.value)
						}}
					/>
				)
		},
		[custom1, custom2, custom3, recommend]
	)
	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={"编辑展会信息"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form layout="horizontal" labelCol={{ span: 5 }} form={form} preserve={false} onFinish={onFinish}>
					<Form.Item label={custom("custom1")} name="custom1">
						<TextArea showCount maxLength={50} />
					</Form.Item>
					<Form.Item label={custom("custom2")} name="custom2">
						<Input maxLength={50} />
					</Form.Item>
					<Form.Item label={custom("custom3")} name="custom3">
						<TextArea showCount maxLength={50} />
					</Form.Item>
					<Form.Item label={custom("recommend")} name="recommend">
						<TextArea showCount maxLength={150} />
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

export default UpdateExhibitionInfoModal
