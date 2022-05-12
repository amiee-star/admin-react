import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space } from "antd"
import serviceUser from "@/services/service.user"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import userInfoModal from "@/components/modal/system/userInfo.modal"

const RegisteredUser = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	console.log(params)
	const showInfo = useCallback(
		(item: any) => () => {
			ModalCustom({
				content: userInfoModal,
				params: {
					id: item.id
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
						<Button size="middle" type="primary" onClick={showInfo(item)}>
							查看详情
						</Button>
					</Space>
				)
			}
		}
	]
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
				<FormSearch
					fields={returnSearchFiels(["mobile", "name", "company", "source", "city", "time"])}
					toSearch={setParams}
					isShowExcel={true}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={null}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"mobile",
						"source",
						"hall",
						"name",
						"area",
						"company",
						"registerDate"
					]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceUser.getRegisteredList}
				/>
			</Col>
		</Row>
	)
}
RegisteredUser.title = "注册用户"
RegisteredUser.icon = "iconfont iconpeizhigongneng"
export default RegisteredUser
