import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Row, Typography, Image } from "antd"

import React, { useCallback } from "react"
import { ModalRef } from "../modal.context"

import proxy from "../../../../config/proxy"

interface Props {
	url: string
	appletUrl: string
}
const SceneModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, url, appletUrl } = props
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={{ width: 550 }}
			title={"展会网址"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row gutter={[20, 0]}>
				<Col span={24}>
					<Row justify="center">
						<Col>
							<Typography.Paragraph copyable>{url}</Typography.Paragraph>
						</Col>
						<Col>
							<Image height="200px" width="200px" src={`${proxy.imageUrl[API_ENV]}/${appletUrl}`}></Image>
						</Col>
					</Row>
				</Col>
				<Col span={24}>
					<Row justify="center">
						<Col>
							<Button type="primary" onClick={closeModal}>
								关闭
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	)
}

export default SceneModal
