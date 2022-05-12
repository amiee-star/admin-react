import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import serviceManage from "@/services/service.manage"
import EditStartVideoModal from "@/components/modal/manage/editStartVideo"

const StartVideo = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		eventBus.on("doStartVideo", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doStartVideo")
		}
	}, [])
	useEffect(() => {
		withParams.current = params
	}, [params])

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "id",
			key: "options",
			fixed: "right",
			width: 160,
			align: "center",
			render: () => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={handle}>
							编辑
						</Button>
					</Space>
				)
			}
		}
	]

	// 编辑
	const handle = useCallback(() => {
		ModalCustom({
			content: EditStartVideoModal
		})
	}, [])
	return (
		<div id="liveStream">
			<Row className="data-form full">
				<Col className="form-result" span={24}>
					<ListTable
						rowIx="name"
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields(["sort", "menuName", "videoSize"]).concat(columns)}
						apiService={serviceManage.getStartVideo}
					/>
				</Col>
			</Row>
		</div>
	)
}
StartVideo.title = "开场视频"
export default StartVideo
