import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Modal, Row, Space } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import { PageData, sumInvest, sumInvestData, sumInvestList, wendatiList } from "@/interfaces/api.interface"
import "./questionDetail.modal.less"
import serviceManage from "@/services/service.manage"
interface Props {
	id: number
	topics: string
}
const QuestionDetailModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, topics } = props
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const [list, setList] = useState<wendatiList[]>([])
	const [data, setData] = useState<PageData>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceManage.wendatiList({ infoId: props.id }).then(res => {
			if (res.code === 200) {
				setList(res.data.entities)
				setData(res.data)
				setDone(true)
			} else {
				setDone(true)
			}
		})
	}, [])

	return (
		done && (
			<Card
				style={{ width: 980 }}
				title={<Row justify="center">{`${data.count}人参加答题`}</Row>}
				extra={
					<Space>
						<Button type="text" onClick={closeModal}>
							<CloseOutlined />
						</Button>
					</Space>
				}
			>
				<div>
					<div>{`问题: ${topics}`}</div>
					{list.map((topic, index) => {
						return (
							<div key={topic.id} className="topicBox">
								<Row justify="space-between" style={{ marginBottom: "10px" }}>
									<Col>{`姓名： ${topic.name}`}</Col>
									<Col>{`手机号： ${topic.mobile}`}</Col>
									<Col>{`答题时间： ${topic.time}`}</Col>
								</Row>
								<div className="answer">
									<div style={{ paddingRight: "3px" }}>答： </div> <div>{`${topic.details}`}</div>
								</div>
							</div>
						)
					})}
				</div>

				<Row justify="center">
					<Button type="text" onClick={closeModal} style={{ backgroundColor: "#d7d7d7" }}>
						关闭
					</Button>
				</Row>
			</Card>
		)
	)
}

export default QuestionDetailModal
