import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, Modal } from "antd"
import serviceData from "@/services/service.data"
import { returnColumnFields } from "@/utils/column.fields"
import AddTradeClass from "@/components/modal/class/tradeClass.modal"
import updateTradeClass from "@/components/modal/class/updateTradeClass.modal"

const TradeClass = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
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
			render: (v: any, item: any) => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={handle(item.id)}>
							新增
						</Button>
						<Button size="middle" type="primary" onClick={handleInfo(item)} style={{ backgroundColor: "#05B7B7" }}>
							编辑
						</Button>
						<Button size="middle" type="primary" danger onClick={deleteTradeClass(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]

	const deleteTradeClass = (id: string) => () => {
		Modal.confirm({
			title: "删除分类",
			content: "是否删除分类?",
			closable: true,
			onOk: () => {
				serviceData.deleteTradeClass([id]).then(res => {
					if (res.code === 200) {
						eventBus.emit("doTradeClass")
					}
				})
			}
		})
	}

	// 新增分类
	const handle = (id?: number) => () => {
		ModalCustom({
			content: AddTradeClass,
			params: {
				id
			}
		})
	}
	// 分配权限
	const handleInfo = (item: {}) => () => {
		ModalCustom({
			content: updateTradeClass,
			params: {
				item: item
			}
		})
	}
	// 抛出事件
	useEffect(() => {
		eventBus.on("doTradeClass", () => {
			setParams({ ...withParams.current })
		})
		return () => {
			eventBus.off("doTradeClass")
		}
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>行业分类</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle()}>
							添加一级分类
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<Row className="data-form full">
			<Col className="form-result" span={24}>
				<ListTable
					expandable={{
						defaultExpandedRowKeys: new Array(999).fill("").map((m, index) => index)
					}}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["title"]).concat(columns)}
					apiService={serviceData.getTradeClassList}
				/>
			</Col>
		</Row>
	)
}
TradeClass.title = "行业分类"
export default TradeClass
