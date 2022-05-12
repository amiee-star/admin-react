import { PageProps } from "@/interfaces/app.interface"
import { Row, Col, List, Button, Space } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import bannerImg from "@/assets/images/backstage/banner.png"
import "./dashboard.less"
import serviceSys from "@/services/service.sys"
import moment from "moment"
import { ModalCustom } from "@/components/modal/modal.context"
import SceneModal from "@/components/modal/other/scene.modal"
import { ExhibitionListData } from "@/interfaces/api.interface"
import FormEditor from "@/components/form/form.editor"
const HomeDashboard = (props: PageProps) => {
	const [toStart, setToStart] = useState(0)
	const [going, setGoing] = useState(0)
	const [finished, setFinished] = useState(0)
	const [listData, setListData] = useState<ExhibitionListData[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [total, setTotal] = useState(0)
	useEffect(() => {
		serviceSys.getExhibitionList({ pageSize: 4, currentPage: currentPage }).then(res => {
			if (res.code === 200) {
				setTotal(res.data.count)
				setListData(res.data.entities)
			}
		})
	}, [currentPage])

	useEffect(() => {
		serviceSys.getShowStatus({}).then(res => {
			if (res.code === 200) {
				setToStart(res.data.notStarted)
				setGoing(res.data.inProcess)
				setFinished(res.data.finished)
			}
		})
	})

	const goHall = useCallback(
		(id: number) => () => {
			window.open(`${window.location.origin}/manage/welcomePage.html?exhibitionId=${id}`)
		},
		[]
	)
	const goNetUrl = useCallback(
		(url: string, appletUrl: string) => () => {
			ModalCustom({
				content: SceneModal,
				params: {
					url,
					appletUrl
				}
			})
		},
		[]
	)
	return (
		<Row id="welcomePage">
			{/* <Col>欢迎使用展会内容管理后台</Col> */}
			{/* <FormEditor /> */}
			<Col span={24}>
				<img src={bannerImg}></img>
			</Col>
			<Col span={24}>
				<div className="hall-box">
					{/* 现有展会状态 */}
					<div className="hall-status">
						<Row align="middle" justify="end">
							<Col span={6} className="hall-tipBox">
								<div className="hall-tip"></div>
								<span className="hall-tipWord">{"现有展会状态"}</span>
							</Col>
							<Col span={6}>
								<div>
									<span className="toStart-num">{toStart}</span>
									<span className="toStart-num2">{"/个"}</span>
								</div>
								<div className="toStart-word">{"待开始"}</div>
							</Col>
							<Col span={6}>
								<div>
									<span className="going-num">{going}</span>
									<span className="going-num2">{"/个"}</span>
								</div>
								<div className="going-word">{"进行中"}</div>
							</Col>
							<Col span={6}>
								<div>
									<span className="finished-num">{finished}</span>
									<span className="finished-num2">{"/个"}</span>
								</div>
								<div className="finished-word">{"已结束"}</div>
							</Col>
						</Row>
					</div>

					<div className="hall-list">
						<Row align="middle" justify="end">
							<Col span={24} className="hall-list-tipBox">
								<div className="hall-list-tip"></div>
								<span className="hall-list-tipWord">{"您管理的展会"}</span>
							</Col>
							<Col span={24}>
								<List
									itemLayout="vertical"
									size="large"
									pagination={{
										onChange: page => {
											setCurrentPage(page)
										},
										pageSize: 4,
										total: total
									}}
									dataSource={listData}
									renderItem={item => (
										<List.Item className="list-item" style={{ display: "flex", alignItems: "center" }}>
											<div style={{ width: "200px" }}>{item.title}</div>
											<div>{`${moment(item.startTime).format("YYYY年MM月DD日")}~${moment(item.endTime).format(
												"YYYY年MM月DD日"
											)}`}</div>
											{item.state == 0 ? (
												<div
													style={{
														fontSize: "16px",
														color: "#3F99FF",
														fontWeight: 700
													}}
												>
													{"待开始"}
												</div>
											) : item.state == 1 ? (
												<div style={{ fontSize: "16px", color: "#66A100", fontWeight: 700 }}>{"进行中"}</div>
											) : (
												<div style={{ fontSize: "16px", color: "#626262", fontWeight: 700 }}>{"已结束"}</div>
											)}
											<Space direction="horizontal">
												<Button className="list-item-button" onClick={goHall(item.id)}>
													展会管理
												</Button>
												<Button className="list-item-button" onClick={goNetUrl(item.exhibitionLink, item.appletUrl)}>
													展会网址
												</Button>
											</Space>
										</List.Item>
									)}
								/>
							</Col>
						</Row>
					</div>
				</div>
			</Col>
		</Row>
	)
}
HomeDashboard.title = "欢迎"
HomeDashboard.menu = false
export default HomeDashboard
