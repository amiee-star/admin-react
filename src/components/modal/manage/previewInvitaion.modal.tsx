import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Row, Col } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import limitNumber from "@/utils/checkNum.func"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import Item from "antd/lib/list/Item"
import { previewInvitaion } from "@/interfaces/api.interface"
import Paragraph from "antd/lib/typography/Paragraph"

interface Props {
	id: string
}
let mark = true
const PreviewInvitationModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const [previewData, setPreviewData] = useState<previewInvitaion>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceManage.previewInvitaion({ id }).then(res => {
			if (res.code === 200) {
				if (res.data) {
					setPreviewData(res.data)
				}
				setDone(true)
			} else {
				message.error(res.msg)
			}
		})
	}, [])
	return (
		done && (
			<Card
				style={{ width: 700 }}
				title="预览"
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Row>
					<Col span={12}>
						<iframe
							src={previewData.url}
							// src={
							// 	"https://testfocus.dahuatech.com/h5/pages/invite/invite?id=975ae59d45bb9257a0ded92b765d949b&isPreview=1"
							// }
							frameBorder={0}
							style={{ width: "100%", height: "650px" }}
							// sandbox=" allow-forms allow-orientation-lock"
						></iframe>
					</Col>
					<Col span={12} style={{ height: "650px", paddingLeft: "20px" }}>
						<div>预览地址：</div>
						{/* <div style={{ marginBottom: "40px" }}>{previewData.url}</div> */}
						<Paragraph copyable={{ tooltips: false }}>{previewData.url}</Paragraph>
						<div>预览二维码：</div>
						<img
							src={`${urlFunc.getHost("imageUrl")}/${previewData.qrCode}`}
							style={{ width: "100px", height: "100px" }}
						/>
					</Col>
				</Row>
			</Card>
		)
	)
}

export default PreviewInvitationModel
