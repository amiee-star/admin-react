import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, message, Modal } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import AddInvestigationmodal from "@/components/modal/manage/addInvestigation.model"
import serviceManage from "@/services/service.manage"
import SumInvestigationModal from "@/components/modal/system/sumInvestigationmodal"
import { investItemData } from "@/interfaces/api.interface"

const Investigation = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const [createButton, setCreateButton] = useState<boolean>(true)
	const exhibitionId = location.search.split("exhibitionId=")[1]

	const cinvest = useCallback((data: investItemData) => {
		setCreateButton(!data)
	}, [])

	const upInvest = useCallback(
		(id: number) => () => {
			const params = {
				id,
				exhibitionId
			}
			serviceManage.upInvestigation(params).then(res => {
				if (res.code === 200) {
					// eventBus.emit("doInvestigation")
					setParams({ ...withParams.current })
					message.success("修改成功")
				}
			})
		},
		[]
	)
	const downInvest = useCallback(
		(id: number) => () => {
			const params = {
				id,
				exhibitionId
			}
			serviceManage.downInvestigation(params).then(res => {
				if (res.code === 200) {
					// eventBus.emit("doInvestigation")
					setParams({ ...withParams.current })
					message.success("修改成功")
				}
			})
		},
		[]
	)

	useEffect(() => {
		eventBus.on("doInvestigation", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doInvestigation")
		}
	}, [])

	useEffect(() => {
		withParams.current = params
	}, [params])
	console.log(withParams)
	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "id",
			key: "options",
			width: 160,
			align: "center",
			render: (v: any, item: any) => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={handle(item.id)}>
							编辑
						</Button>
						{item.status !== 1 ? (
							<Button size="middle" type="primary" onClick={upInvest(item.id)}>
								上架
							</Button>
						) : (
							<Button size="middle" type="primary" onClick={downInvest(item.id)}>
								下架
							</Button>
						)}

						<Button size="middle" type="primary" onClick={details(item.id)}>
							查看
						</Button>
					</Space>
				)
			}
		}
	]
	const details = (id: number) => () => {
		ModalCustom({
			content: SumInvestigationModal,
			params: {
				id
			}
		})
	}

	// 创建编辑合作媒体
	const handle = (id?: number) => () => {
		ModalCustom({
			content: AddInvestigationmodal,
			params: {
				id
			}
		})
	}

	const titleRender = useCallback(
		() =>
			createButton && (
				<Row justify="space-between" align="middle">
					<Col></Col>
					<Col>
						<Space>
							<Button type="primary" onClick={handle()}>
								创建问卷
							</Button>
						</Space>
					</Col>
				</Row>
			),
		[createButton]
	)
	return (
		<div>
			<Row className="data-form full">
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						exportData={cinvest}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields([
							"sort",
							"investname",
							"investstatus",
							"joinnumber",
							"investcreator",
							"investtime"
						]).concat(columns)}
						//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
						apiService={serviceManage.getInvestigationInfo}
						transformData={data => [data]}
					/>
				</Col>
			</Row>
		</div>
	)
}
Investigation.title = "问卷调查"
export default Investigation
