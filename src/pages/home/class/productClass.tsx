import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, Modal } from "antd"
import serviceData from "@/services/service.data"
import { returnColumnFields } from "@/utils/column.fields"
import AddproductClass from "@/components/modal/class/productClass.modal.tsx"
import UpadateproductClass from "@/components/modal/class/updateProductClass.modal.tsx"

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
						<Button size="middle" type="primary" danger onClick={deleteProductClass(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]

	const deleteProductClass = (id: string) => () => {
		Modal.confirm({
			title: "删除分类",
			content: "是否删除分类?",
			closable: true,
			onOk: () => {
				serviceData.deleteProductClass([id]).then(res => {
					if (res.code === 200) {
						eventBus.emit("doProductClass")
					}
				})
			}
		})
	}

	// 新增分类
	const handle = (id: string) => () => {
		ModalCustom({
			content: AddproductClass,
			params: {
				id
			}
		})
	}
	// 编辑
	const handleInfo = (item: {}) => () => {
		ModalCustom({
			content: UpadateproductClass,
			params: {
				item: item
			}
		})
	}
	// 抛出事件
	useEffect(() => {
		eventBus.on("doProductClass", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doProductClass")
		}
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>产品分类</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle("")}>
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
					apiService={serviceData.getProductClassList}
				/>
			</Col>
		</Row>
	)
}
TradeClass.title = "产品分类"
export default TradeClass
