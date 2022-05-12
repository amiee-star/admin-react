import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Row, Col, Select } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "../modal.context"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import { ChromePicker } from "react-color"
import "./invitationCard.modal.less"
import html2canvas from "html2canvas"
import ColorPick from "@/components/utils/colorPicker"
interface Props {
	id: string
}
interface Template {
	label: string
	value: string
}
const InvitationCardModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [opt, setOpt] = useState([])
	const [ifselfDefine, setIfselfDefine] = useState<boolean>(false)
	const [backimage, setBackimage] = useState<string>()
	const [formbackimg, setFormbackimg] = useState<string>()
	const [logoimg, setLogoimg] = useState<string>()
	const [qrimg, setQrimg] = useState<string>()
	const [theme, setTheme] = useState<string>()
	const [content, setContent] = useState<string>()
	const [qrDes, setQrDes] = useState<string>()
	const [defSelect, setDefSelect] = useState<string>()
	const [template, setTemplate] = useState<Template[]>()
	const [fontColor, setFontColor] = useState<string>("#9b7e2a")

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	let mark = true

	//颜色设置
	const changeColor = useCallback(color => {
		setFontColor(color.hex)
	}, [])
	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			const params = {
				...data,
				logoUrl: data.logoUrl && data.logoUrl.length > 0 ? data.logoUrl[0].fileSaveUrl : "",
				qrUrl: data.qrUrl && data.qrUrl.length > 0 ? data.qrUrl[0].fileSaveUrl : "",
				backUrl: formbackimg || (data.backUrl[0] && data.backUrl[0].fileSaveUrl),
				style: fontColor,
				id
			}

			if (!params.backUrl) {
				return message.error("背景图不能为空")
			}
			serviceManage
				.updateInvitaionCardInfo(params)
				.then(res => {
					if (res.code === 200) {
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
		[backimage, fontColor]
	)

	const formatFile = (url: any) => {
		if (url instanceof Array) {
			const arr: { filePreviewUrl: string; fileSaveUrl: string; fileSize: number }[] = []
			url.forEach(item => {
				arr.push({
					filePreviewUrl: item,
					fileSaveUrl: item,
					fileSize: 0
				})
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: url,
					fileSaveUrl: url,
					fileSize: 0
				}
			]
		}
	}
	useEffect(() => {
		let bacurl = ""
		serviceManage.getInvitationCardInfo({ id }).then(res => {
			if (res.code === 200) {
				if (res.data) {
					if (res.data.style) {
						setFontColor(res.data.style)
					}
					if (res.data.logoUrl) {
						serviceManage.filedownload({ url: res.data.logoUrl }).then(res => {
							setLogoimg(res.data)
						})
					} else {
						setLogoimg(null)
					}
					if (res.data.qrUrl) {
						serviceManage.filedownload({ url: res.data.qrUrl }).then(res => {
							setQrimg(res.data)
						})
					} else {
						setQrimg(null)
					}
					if (res.data.backUrl) {
						serviceManage.filedownload({ url: res.data.backUrl }).then(res => {
							setBackimage(res.data)
						})
					} else {
						setBackimage(null)
					}
					setTheme(res.data.name)
					setContent(res.data.content)
					setQrDes(res.data.qrInfo)
					bacurl = res.data.backUrl
					form.setFieldsValue({
						...res.data,
						logoUrl: res.data.logoUrl ? formatFile(res.data.logoUrl) : null,
						qrUrl: res.data.qrUrl ? formatFile(res.data.qrUrl) : null,
						backUrl: res.data.backUrl ? formatFile(res.data.backUrl) : null
					})
				}
			} else {
				message.error(res.msg)
			}
			serviceManage.getInvitationCardTemp({ pageSize: 99 }).then(res => {
				if (res.code == 200) {
					let arr = res.data.entities.map(item => {
						return { label: item.name, value: item.url }
					})
					setTemplate(arr)
					let selects =
						(arr.filter(item => item.value == bacurl)[0] && arr.filter(item => item.value == bacurl)[0].label) ||
						(!!bacurl && "其他") ||
						arr[0].value
					setDefSelect(selects)
					if (selects === "其他") {
						setIfselfDefine(true)
					} else {
						setIfselfDefine(false)
						if (!bacurl) {
							serviceManage.filedownload({ url: arr[0].value }).then(res => {
								setBackimage(res.data)
							})
							setFormbackimg(arr[0].value)
						}
					}
					arr.push({ label: "其他", value: "其他" })
					setOpt(arr)
					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		})
	}, [])

	// 设置背景图
	const onSelectChange = useCallback(
		value => {
			if (value == "其他") {
				setIfselfDefine(true)
				setFormbackimg(null)

				if (form.getFieldValue("backUrl") && form.getFieldValue("backUrl")[0]) {
					if (template.map(item => item.value).includes(form.getFieldValue("backUrl")[0].fileSaveUrl)) {
						form.setFieldsValue({ backUrl: [] })
						setBackimage(null)
					} else {
						serviceManage.filedownload({ url: form.getFieldValue("backUrl")[0].fileSaveUrl }).then(res => {
							setBackimage(res.data)
						})
					}
				}
			} else {
				setFormbackimg(value)
				serviceManage.filedownload({ url: value }).then(res => {
					setBackimage(res.data)
				})
				setIfselfDefine(false)
			}
		},
		[template]
	)

	// form表单改变时
	const formchange = useCallback(values => {
		if ("name" in values) {
			setTheme(values.name)
		}
		if ("content" in values) {
			setContent(values.content)
		}
		if ("qrInfo" in values) {
			setQrDes(values.qrInfo)
		}
		if ("logoUrl" in values) {
			if (values.logoUrl[0]) {
				serviceManage.filedownload({ url: values.logoUrl[0].fileSaveUrl }).then(res => {
					setLogoimg(res.data)
				})
			} else {
				setLogoimg(null)
			}
		}
		if ("qrUrl" in values) {
			if (values.qrUrl[0]) {
				serviceManage.filedownload({ url: values.qrUrl[0].fileSaveUrl }).then(res => {
					setQrimg(res.data)
				})
			} else {
				setQrimg(null)
			}
		}
		if ("backUrl" in values) {
			if (values.backUrl[0]) {
				serviceManage.filedownload({ url: values.backUrl[0].fileSaveUrl }).then(res => {
					setBackimage(res.data)
				})
			} else {
				setBackimage(null)
			}
		}
	}, [])

	const base64ToBlob = (code: any) => {
		let parts = code.split(";base64,")
		let contentType = parts[0].split(":")[1]
		let raw = window.atob(parts[1])
		let rawLength = raw.length

		let uInt8Array = new Uint8Array(rawLength)

		for (let i = 0; i < rawLength; ++i) {
			uInt8Array[i] = raw.charCodeAt(i)
		}
		return new Blob([uInt8Array], { type: contentType })
	}

	const downloadFile = (fileName: string, content: string) => {
		let aLink = document.createElement("a")
		let blob = base64ToBlob(content) //new Blob([content]);

		let evt = document.createEvent("HTMLEvents")
		evt.initEvent("click", true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
		aLink.download = fileName
		aLink.href = URL.createObjectURL(blob)
		aLink.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window })) //兼容火狐
	}

	const takesoot = useCallback(() => {
		html2canvas(document.getElementById("InvitationCardImg"), {
			scale: 2,
			logging: false,
			useCORS: false,
			allowTaint: false
		}).then(canvas => {
			var image = new Image()
			image.src = canvas.toDataURL("image/png")
			downloadFile("邀请卡.png", `${image.src}`)
		})
	}, [])
	return (
		done && (
			<Card
				style={{ width: 920 }}
				title="邀请卡编辑"
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Row>
					<Col span={12}>
						<Form
							layout="horizontal"
							labelCol={{ span: 5 }}
							wrapperCol={{ span: 19 }}
							form={form}
							preserve={false}
							onFinish={onFinish}
							onValuesChange={formchange}
						>
							<Form.Item label="模板:">
								<Select options={opt} onChange={onSelectChange} defaultValue={defSelect} />
							</Form.Item>
							<Form.Item label="背景图：" extra="支持5M以内 PNG,JPG图片" name="backUrl" hidden={!ifselfDefine} required>
								<FormUploads
									baseUrl="imageUrl"
									accept="image/*"
									customCheck={checkImage("image", 5)}
									checkType={"image"}
								/>
							</Form.Item>
							<Form.Item label="主题:" name="name">
								<Input maxLength={20} />
							</Form.Item>
							<Form.Item label="logo：" extra="支持5M以内 PNG,JPG图片" name="logoUrl">
								<FormUploads
									baseUrl="imageUrl"
									accept="image/*"
									customCheck={checkImage("image", 5)}
									checkType={"image"}
								></FormUploads>
							</Form.Item>
							<Form.Item label="活动" name="content">
								<Input maxLength={20} />
							</Form.Item>
							<Form.Item label="二维码图片：" extra="支持5M以内 PNG,JPG图片" name="qrUrl">
								<FormUploads
									baseUrl="imageUrl"
									accept="image/*"
									customCheck={checkImage("image", 5)}
									checkType={"image"}
								></FormUploads>
							</Form.Item>
							<Form.Item label="二维码描述" name="qrInfo">
								<Input maxLength={20} />
							</Form.Item>
							<Form.Item label="字体颜色">
								<ColorPick setCo={setFontColor} colorprop={fontColor} />
							</Form.Item>
							<Form.Item style={{ textAlign: "right" }}>
								<Button type="primary" htmlType="submit">
									保存
								</Button>
								<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
									取消
								</Button>
								<Button style={{ marginLeft: 10 }} type="primary" htmlType="button" onClick={takesoot}>
									下载邀请卡
								</Button>
							</Form.Item>
						</Form>
					</Col>
					<Col span={12}>
						<div id="InvitationCardImg">
							{backimage && (
								<img src={`data:image/png;base64,${backimage}`} style={{ width: "100%", height: "100%" }} />
							)}
							{logoimg && <img src={`data:image/png;base64,${logoimg}`} className="logoimg" />}

							<div className="qrimgoutline"></div>
							{qrimg && <img src={`data:image/png;base64,${qrimg}`} className="qrimg" />}

							<div className="theme" style={{ color: fontColor }}>
								{theme}
							</div>
							<div className="content" style={{ color: fontColor }}>
								{content}
							</div>
							<div className="qrdes" style={{ color: fontColor }}>
								{qrDes}
							</div>
						</div>
					</Col>
				</Row>
			</Card>
		)
	)
}

export default InvitationCardModel
