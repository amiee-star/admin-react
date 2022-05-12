import { PageProps } from "@/interfaces/app.interface"
import React, { useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { Row, Col } from "antd"
import serviceSys from "@/services/service.sys"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"

const Log = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])

	// 抛出事件
	useEffect(() => {
		eventBus.on("doSceneTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneTemplate")
		}
	}, [])

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["logKeyword", "signTime"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					// title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "account", "userName", "IP", "time", "log"])}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.getLog}
					// dataSource={dataSource}
				/>
			</Col>
		</Row>
	)
}
Log.title = "系统日志"
export default Log
