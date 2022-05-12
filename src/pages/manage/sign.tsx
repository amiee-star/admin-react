import { PageProps } from "@/interfaces/app.interface"
import React, { useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { Row, Col } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"

import serviceManage from "@/services/service.manage"
const Sign = (props: PageProps) => {
	const [params, setParams] = useState({})

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

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["keyword", "timeRange"])}
					toSearch={setParams}
					isShowExcel
					provideUrl={`/exhibition/sign/export`}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					// title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "accountName", "mobile", "signTime", "locationName", "location"])}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceManage.getSign}
				// dataSource={dataSource}
				/>
			</Col>
		</Row>
	)
}
Sign.title = "签到记录"
export default Sign
