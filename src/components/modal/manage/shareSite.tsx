import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Switch, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"

import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"

import serviceManage from "@/services/service.manage"
import limitNumber from "@/utils/checkNum.func"
import { SharesiteData } from "@/interfaces/api.interface"
import urlFunc from "@/utils/url.func"
import Paragraph from "antd/lib/typography/Paragraph"

interface Props {
	id: string
	industryName: string
	state: boolean
}
const Sharesite: React.FC<Props & ModalRef> = props => {
	const { modalRef, id, industryName } = props
	// const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState<Boolean>(false)
	const [qrUrl, setQrUrl] = useState<string>()
	const [shareUrl, setShareUrl] = useState<string>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		if (id) {
			serviceManage.shareSite({ id: props.id }).then(res => {
				if (res.code === 200) {
					setQrUrl(res.data.qrUrl)
					setShareUrl(res.data.shareUrl)
					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		}
	}, [])
	console.log(qrUrl)

	return (
		done && (
			<Card
				style={{ width: 360 }}
				title={`${industryName}2.5D页面`}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				{props.state ? (
					<div>
						<Paragraph copyable={{ tooltips: false }}>{shareUrl}</Paragraph>
						<div>
							<img src={`${urlFunc.getHost("imageUrl")}/${qrUrl}`} />
						</div>
					</div>
				) : (
					<div style={{ color: "#ff0000", textAlign: "center" }}>请先开启显示状态</div>
				)}
			</Card>
		)
	)
}

export default Sharesite
