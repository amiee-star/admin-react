import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Modal, Row, Space } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import QuestionDetailModal from "./questionDetail.modal"
import { sumInvest, sumInvestData, sumInvestList } from "@/interfaces/api.interface"
import "./sumInvestigationmodal.less"
import serviceManage from "@/services/service.manage"
import lsFunc from "@/utils/ls.func"
import UrlFunc from "@/utils/url.func"
interface Props {
	id: number
}
const SumInvestigationModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const token = lsFunc.getItem("token")

	const [topicList, setTopicList] = useState<sumInvest[]>([])
	const topicType = ["", "单选", "多选", "问答题"]
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [done, setDone] = useState(false)
	const [data, setData] = useState<sumInvestData>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		serviceManage.sumInvestigation({ id: props.id, exhibitionId }).then(res => {
			if (res.code === 200) {
				setData(res.data)
				setTopicList(res.data.list)
				setDone(true)
			} else {
				setDone(true)
			}
		})
	}, [])

	const details = useCallback(
		(id: number, topics: string) => () => {
			ModalCustom({
				content: QuestionDetailModal,
				params: {
					id,
					topics
				}
			})
		},
		[]
	)
	return (
		done && (
			<Card
				style={{ width: 980 }}
				title={<Row justify="center">{`${data.joinNum}人参加问卷`}</Row>}
				extra={
					<Space>
						<Button
							type="text"
							// onClick={closeModal}
							style={{ backgroundColor: "#02a7f0", color: "#ffffff" }}
							href={`${UrlFunc.getHost()}/admin/questionnaire/export?id=${props.id}&token=${token}`}
						>
							导出Excel
						</Button>
					</Space>
				}
			>
				<div>
					{topicList.map((topic, index) => {
						return (
							<div key={topic.id} className="topicBox">
								{topic.type !== 3 ? (
									<div>
										<div className="tipic">{`${index + 1}、 ${topic.topic} (${topicType[topic.type]})`}</div>
										{topic.list.map(value => {
											return (
												<div key={value.choice} className="infoBox">
													<div>{`${value.choice}、 ${value.content}`}</div>
													<div className="bar" style={{ width: `${value.proportion}` }}>
														<span>{`${value.num}票`}</span>
														<span>{`(${value.proportion})`}</span>
													</div>
												</div>
											)
										})}
									</div>
								) : (
									<div className="flex">
										<div className="tipic">{`${index + 1}、 ${topic.topic} (${topicType[topic.type]}) `}</div>
										<div>{`参加答题人数（${topic.info}人）`}</div>
										<Button
											type="text"
											style={{ backgroundColor: "#02a7f0", color: "#ffffff", marginRight: "25px" }}
											onClick={details(topic.id, topic.topic)}
										>
											查看
										</Button>
									</div>
								)}
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

export default SumInvestigationModal
