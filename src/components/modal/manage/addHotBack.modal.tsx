import { CloseOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Image, message, Radio, Space } from "antd"
import React, { useCallback, useEffect, useState } from "react"

import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import "./addHotBack.modal.less"
import serviceManage from "@/services/service.manage"
import limitNumber from "@/utils/checkNum.func"
import ColorPick from "@/components/utils/colorPicker"
import { divide } from "lodash"
import FormUploads from "@/components/form/form.uploads"
import urlFunc from "@/utils/url.func"

interface Props {}
const AddHotBackModel: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	let mark = true
	const [done, setDone] = useState(false)
	const [fontColor, setFontColor] = useState<string>("#ffffff")
	const [customFontColor, setCustomFontColor] = useState<string>()
	const [typeValue, setTypeValue] = useState<number>(1)
	const [id, setId] = useState<number>()
	const [backImage, setBackImage] = useState<string>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const RadioChange = useCallback(e => {
		if ("isDefault" in e) {
			setTypeValue(e["isDefault"])
		}
		if ("backImg" in e) {
			if (e["backImg"].length) {
				setBackImage(e["backImg"][0].fileSaveUrl)
			} else {
				setBackImage(null)
			}
		}
	}, [])

	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			const params = {
				...data,
				backImg: typeValue ? "" : data.backImg[0].fileSaveUrl,
				id,
				hex: fontColor,
				hexC: customFontColor
			}

			serviceManage
				.updateHotBack(params)
				.then(res => {
					if (res.code === 200) {
						modalRef.current.destroy()
						message.success("更新成功")
						form.resetFields()
					} else {
						message.error(res.msg)
					}
				})
				.finally(() => {
					mark = true
				})
		},
		[id, fontColor, typeValue, customFontColor]
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

	const clearImg = useCallback(() => {
		setBackImage(null)
		form.setFieldsValue({ backImg: [] })
	}, [])
	useEffect(() => {
		serviceManage.getHotBack().then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data,
					backImg: res.data.isDefault ? "" : formatFile(res.data.backImg)
				})
				setId(res.data.id)
				setTypeValue(res.data.isDefault)
				if (!res.data.isDefault) {
					setBackImage(res.data.backImg)
				}
				setFontColor(res.data.hex || "#ffffff")
				setCustomFontColor(res.data.hexC || "#32415f")
				setDone(true)
			} else {
				message.error(res.msg)
			}
		})
	}, [])

	return (
		done && (
			<Card
				style={{ width: 530 }}
				title="热点背景图编辑"
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
					onValuesChange={RadioChange}
				>
					<Form.Item name="isDefault">
						<Radio.Group>
							<Radio value={1}>默认</Radio>
							<Radio value={0}>自定义</Radio>
						</Radio.Group>
					</Form.Item>
					{/* 默认设置 */}
					<Form.Item style={{ display: typeValue ? "" : "none" }}>
						<div className="defaultHotwrapper">
							<img className="backimg" src={`${urlFunc.replaceUrl("default_hotspot_back_img.png", "imageUrl")}`} />
							<div className="zhanwei" style={{ color: fontColor }}>
								热点背景图
							</div>
							<div className="backGroud" style={{ color: fontColor }}></div>
							<div className="wenziwapper">
								<div className="wenzi">文字颜色: </div>
								<ColorPick setCo={setFontColor} colorprop={fontColor} />
							</div>
						</div>
					</Form.Item>
					{/* 自定义设置 */}
					<Form.Item style={{ display: typeValue || !backImage ? "none" : "" }}>
						<div className="zidingyiHotwrapper">
							<div className="backGroudImg">
								{backImage ? <img className="imageBack" src={`${urlFunc.replaceUrl(backImage, "imageUrl")}`} /> : null}
								<div
									className="textCon"
									style={{
										color: customFontColor
									}}
								>
									热点背景图
								</div>
							</div>
							<DeleteOutlined onClick={clearImg} hidden={!backImage} className="deleteIcon" />
							<div className="wenziwapper">
								<div className="wenzi">文字颜色: </div>
								<ColorPick setCo={setCustomFontColor} colorprop={customFontColor} />
							</div>
						</div>
					</Form.Item>
					<Form.Item
						label="热点背景图："
						extra="背景图分辨率: 160*45"
						name="backImg"
						rules={[{ required: typeValue ? false : true, message: "请上传图片" }]}
						style={{ display: typeValue || backImage ? "none" : "" }}
					>
						<FormUploads
							accept=".png, .jpg, .jpeg"
							checkType={"hotImage"}
							size={1}
							imgAction={{ crop: true, aspectRatio: [160, 45] }}
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

export default AddHotBackModel
