import { CloseOutlined, CloudUploadOutlined } from "@ant-design/icons"
import { Button, Card, Form, Select, Upload, message } from "antd"
import React, { useCallback } from "react"
import { ModalRef } from "../modal.context"

import "./batchUpload.modal.less"

import lsFunc from "@/utils/ls.func"
import urlFunc from "@/utils/url.func"
import ProxyConfig from "@/../config/proxy"
import eventBus from "@/utils/event.bus"
interface Props {
	id: string
}
const SensitiveBatchUploadModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const token = lsFunc.getItem("token")
	console.log(token)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const uploadProps = {
		name: "file",
		action: `${urlFunc.requestHost()}/admin/sensitiveWord/importSensitiveWord`,
		headers: {
			authorization: "authorization-text",
			token: lsFunc.getItem("token")
		},

		onChange(info: any) {
			if (info.file.status === "done") {
				if (info.file.response.code == 200) {
					message.success(`敏感词模板批量上传成功`)
				} else {
					message.error(info.file.response.msg || `敏感词批量上传失败`)
				}
			} else if (info.file.status === "error") {
				message.error(`${info.file.name}批量上传失败.`)
			}
		}
	}
	const onFinish = useCallback(data => {
		closeModal()
		history.go(0)
	}, [])

	return (
		<Card
			id="batchUploadBox"
			style={{ width: 500 }}
			title={"批量上传"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="productInfo">
				<div className="productInfoForm">
					<Form
						layout="horizontal"
						labelCol={{ span: 6 }}
						// wrapperCol={{ span: 19 }}
						form={form}
						preserve={false}
						onFinish={onFinish}
					>
						<Form.Item label="上传：" name="image">
							<Upload {...uploadProps}>
								<Button icon={<CloudUploadOutlined />} style={{ color: "#ffff", backgroundColor: "#027DB4" }}>
									批量上传
								</Button>
							</Upload>
						</Form.Item>
						<Form.Item label="模板下载：">
							<Button
								type="text"
								style={{ color: "#02A7F0" }}
								href={`${ProxyConfig.api.pro}/admin/sensitiveWord/downloadSensitiveWordTemplate?token=${token}`}
							>
								敏感词批量上传模板
							</Button>
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
				</div>
			</div>
		</Card>
	)
}

export default SensitiveBatchUploadModal
