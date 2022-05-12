import { PageProps } from "@/interfaces/app.interface"
import React, { useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { Row, Col, Space, Button } from "antd"
import serviceSys from "@/services/service.sys"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import { ModalCustom } from "@/components/modal/modal.context"
import { ColumnType } from "antd/lib/table"

const Sign = (props: PageProps) => {
	const [params, setParams] = useState({})

	// const columns: ColumnType<any>[] = [
	// 	{
	// 		title: "操作",
	// 		dataIndex: "id",
	// 		key: "options",
	// 		fixed: "right",
	// 		width: 160,
	// 		align: "center",
	// 		render: (v: any, item: any) => {
	// 			return (
	// 				<Space size={10}>
	// 					<Button size="middle" type="primary" onClick={showInfo(item.id)} style={{ backgroundColor: "#05B7B7" }}>
	// 						详细信息
	// 					</Button>
	// 				</Space>
	// 			)
	// 		}
	// 	}
	// ]

	// 创建 编辑展会信息
	// const showInfo = (id: number) => () => {
	// 	ModalCustom({
	// 		content: SignInfo,
	// 		params: {
	// 			id
	// 		}
	// 	})
	// }
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])

	// 抛出事件
	useEffect(() => {
		eventBus.on("doSign", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSign")
		}
	}, [])
	console.log("params:::::", params)

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["keyword", "exhibitType", "timeRange"])}
					toSearch={setParams}
					isShowExcel
					provideUrl={`/admin/sign/export`}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					// title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"exitbitions",
						"accountName",
						"mobile",
						"signTime",
						"locationName",
						"location"
					])}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.getSign}
					// dataSource={dataSource}
				/>
			</Col>
		</Row>
	)
}
Sign.title = "签到记录"
export default Sign
