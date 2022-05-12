import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import AddLiveStream from "@/components/modal/manage/addLiveStream.modal"
import serviceManage from "@/services/service.manage"

interface liveItem {
	id: number | string
	title: string
	roomId: string
}

const LiveStreamMedia = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		eventBus.on("doLiveStreamList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doLiveStreamList")
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
			render: (v: any, item: liveItem) => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={handle(item)}>
							编辑
						</Button>
					</Space>
				)
			}
		}
	]

	// 编辑
	const handle = useCallback(
		(params: liveItem) => () => {
			ModalCustom({
				content: AddLiveStream,
				params: params
			})
		},
		[]
	)

	// const handle = params => () => {

	// }

	return (
		<div id="liveStream">
			<Row className="data-form full">
				<Col className="form-result" span={24}>
					<ListTable
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields(["sort", "liveTitle", "liveRoom"]).concat(columns)}
						apiService={serviceManage.getLiveStreamList}
					/>
				</Col>
			</Row>
		</div>
	)
}
LiveStreamMedia.title = "直播管理"
export default LiveStreamMedia
