import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import serviceSys from "@/services/service.sys"
import SumInvestigationModal from "@/components/modal/system/sumInvestigationmodal"

const InvestigationList = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const details = useCallback(
		(id: number) => () => {
			ModalCustom({
				content: SumInvestigationModal,
				params: {
					id
				}
			})
		},
		[]
	)

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "id",
			key: "options",
			fixed: "right",
			width: 160,
			align: "center",
			render: (v: any, item: any) => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={details(item.id)}>
							查看
						</Button>
					</Space>
				)
			}
		}
	]

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["exhibitType", "investkeyword", "investStatus", "investTime"])}
					toSearch={setParams}
					//isShowExcel={true}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"exitbitionname",
						"investname",
						"investstatus",
						"investcreator",
						"investtime"
					]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.Investigationlsit}
				/>
			</Col>
		</Row>
	)
}
InvestigationList.title = "问卷调查"
export default InvestigationList
