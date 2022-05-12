import { PageProps } from "@/interfaces/app.interface"
import React, { useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { Row, Col } from "antd"
import serviceSys from "@/services/service.sys"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"

const Information = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])

	// 抛出事件
	useEffect(() => {
		eventBus.on("doInformationUpdate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doInformationUpdate")
		}
	}, [])

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["exhibitType", "informationKey", "informationTel", "informationTime"])}
					toSearch={setParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					// title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"information",
						"informationContent",
						"informationName",
						"informationTel",
						"informationTime"
					])}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.informationList}
					// dataSource={dataSource}
				/>
			</Col>
		</Row>
	)
}
Information.title = "留言管理"
export default Information
