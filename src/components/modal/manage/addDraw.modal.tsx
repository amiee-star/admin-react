import { CloseOutlined, PlusOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, Space, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import limitNumber from "@/utils/checkNum.func"
import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"
import { Award } from "@/interfaces/api.interface"
import Paragraph from "antd/lib/typography/Paragraph"

interface Props {
	id: string
}

interface FormListProps {
	fields: FormListFieldData[]
	action: FormListOperation
	id: string
	form: any
}
let mark = true

const jschars = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"a",
	"b",
	"c",
	"d",
	"e",
	"f",
	"g",
	"h",
	"i",
	"j",
	"k",
	"l",
	"m",
	"n",
	"o",
	"p",
	"q",
	"r",
	"s",
	"t",
	"u",
	"v",
	"w",
	"x",
	"y",
	"z"
]

function s4() {
	let stamp = new Date().getTime().toString().slice(5)
	var str = ""
	for (var i = 0; i < 8; i++) {
		var j = Math.ceil(Math.random() * 61)
		str += jschars[j]
	}
	let arr = (stamp + str).split("")
	arr.sort((a, b) => {
		return Math.random() > 0.5 ? -1 : 1
	})
	let s = arr.join("")
	return s
}

const defaultAudio = "/audio/kamen.mp3" // 默认背景音乐

const DrawUnitList: React.FC<FormListProps> = props => {
	const { fields, action, id, form } = props
	const removeItem = useCallback(
		(name: number) => () => {
			if (id) {
				let arr = form.getFieldValue("awards")
				let awardsId = arr[name].id
				console.log(awardsId)
				serviceManage.awardsCheck({ id: id, awardsId: awardsId }).then(res => {
					if (res.code === 200) {
						action.remove(name)
					} else {
						message.error(res.msg)
					}
				})
			} else {
				action.remove(name)
			}
		},
		[action, fields]
	)
	const addItem = useCallback(() => {
		let id = s4()
		action.add({ id: id })
	}, [action])

	return (
		<>
			{fields.map((field, index) => (
				<Space
					key={field.key}
					direction="vertical"
					style={{
						width: "500px",
						border: "1px dashed #eee",
						padding: "10px",
						position: "relative",
						marginBottom: "10px"
					}}
				>
					<div
						onClick={removeItem(field.name)}
						style={{
							position: "absolute",
							zIndex: 66,
							top: "10px",
							right: "10px",
							cursor: "pointer"
						}}
					>
						<CloseCircleOutlined />
					</div>

					<Form.Item
						style={{
							height: 0,
							opacity: 0
						}}
						{...field}
						rules={[
							{
								required: true,
								message: "请输入抽奖奖项名称!"
							}
						]}
						label="奖项ID："
						name={[field.name, "id"]}
						fieldKey={[field.fieldKey, "id"]}
					>
						<Input maxLength={20} readOnly placeholder="请输入奖项名称（最多20个字符）" />
					</Form.Item>

					<Form.Item
						{...field}
						label="奖品图片："
						name={[field.name, "img"]}
						fieldKey={[field.fieldKey, "img"]}
						extra="文件大小5M之内，分辨率1920*640jpg、png"
						rules={[{ required: true, message: "请上传奖品图片" }]}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							imgAction={{
								crop: true,
								aspectRatio: [640, 640]
							}}
							customCheck={checkImage("image", 5)}
							checkType={"hotImage"}
							size={1}
						></FormUploads>
					</Form.Item>

					<Form.Item
						{...field}
						rules={[
							{
								required: true,
								message: "请输入抽奖奖项名称!"
							}
						]}
						label="奖项名称："
						name={[field.name, "name"]}
						fieldKey={[field.fieldKey, "name"]}
					>
						<Input maxLength={10} placeholder="请输入奖项名称（最多10个字符）" />
					</Form.Item>

					<Form.Item
						{...field}
						rules={[
							{
								required: true,
								message: "请输入奖品内容!"
							}
						]}
						label="奖品内容："
						name={[field.name, "content"]}
						fieldKey={[field.fieldKey, "content"]}
					>
						<Input maxLength={20} placeholder="请输入奖品内容（最多20个字符）" />
					</Form.Item>

					<Form.Item
						{...field}
						label="中奖名额："
						fieldKey={[field.fieldKey, "num"]}
						name={[field.name, "num"]}
						rules={[{ required: true, message: "请输入中奖名额" }]}
					>
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
				</Space>
			))}
			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />}>
					新增奖项
				</Button>
			</Form.Item>
		</>
	)
}

const AddBannerModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)

	const [url, setUrl] = useState<string>("")

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		console.log(data)
		let arr: Award[] = []
		let music = ""
		if (data.music.length) {
			music = data.music[0].fileSaveUrl
		} else {
			return message.info("请上传背景音乐")
		}
		if (data.awards && data.awards.length) {
			data.awards.map((item: Award) => {
				let obj = {
					...item,
					img: item.img[0].fileSaveUrl
				}
				arr.push(obj)
			})
		}
		let params = {
			name: data.name,
			music: music,
			awards: arr
		}
		id ? (params["id"] = id) : null
		console.log(params)
		serviceManage[id ? "uploadDrawActivity" : "addDrawActivity"](params).then(res => {
			if (res.code === 200) {
				message.success("操作成功")
				eventBus.emit("doDrawList")
				closeModal()
			} else {
				message.info(res.msg)
			}
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
			serviceManage.getDrawInfo({ id: props.id }).then(res => {
				if (res.code === 200) {
					let arr: Award[] = []
					if (res.data.awards && res.data.awards.length) {
						res.data.awards.map(item => {
							let obj = {
								...item,
								img: formatFile(item.img)
							}
							arr.push(obj)
						})
					}
					form.setFieldsValue({
						...res.data,
						music: res.data.music ? formatFile(res.data.music) : formatFile(defaultAudio),
						awards: arr
					})
					setUrl(res.data.url)
					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			form.setFieldsValue({
				music: formatFile(defaultAudio)
			})
			setDone(true)
		}
	}, [])

	return (
		done && (
			<Card
				style={{ width: 800 }}
				title={!props.id ? "新增抽奖活动" : "编辑抽奖活动"}
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
						rules={[
							{
								required: true,
								message: "请输入抽奖活动名称!"
							}
						]}
						label="抽奖活动名称："
						name="name"
					>
						<Input maxLength={20} placeholder="请输入抽奖活动名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="背景音乐：" name="music" extra="支持5MB以内的音频文件（mp3），建议码率不超过320kbps">
						<FormUploads
							customCheck={checkImage("audio", 5)}
							checkType={"audio"}
							size={1}
							accept="audio/*"
						></FormUploads>
					</Form.Item>

					<Form.Item label="奖项配置">
						<Form.List name={"awards"}>
							{(fields, action) => <DrawUnitList id={id} form={form} fields={fields} action={action} />}
						</Form.List>
					</Form.Item>

					{url ? (
						<Form.Item label="抽奖活动地址">
							<div
								style={{
									lineHeight: "32px"
								}}
							>
								<Paragraph copyable={{ tooltips: false }}>{url}</Paragraph>
							</div>
						</Form.Item>
					) : null}

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
