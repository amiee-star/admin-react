import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, message, Space, Row, Col, Modal } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import serviceManage from "@/services/service.manage"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/lib/table/interface"
import AddMenuTypeItemModel from "./addMenuTypeItem.modal"
import { MenuTypeItem } from "@/interfaces/api.interface"

interface Props {}
const MenuTypeListModel: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	// 抛出事件
	useEffect(() => {
		eventBus.on("doMenuListModel", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doMenuListModel")
		}
	}, [])

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "id",
			key: "options",
			fixed: "right",
			width: 160,
			align: "center",
			render: (v: number, item: any) => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={AddMenuType(item)}>
							编辑
						</Button>
						<Button size="middle" type="primary" danger onClick={deleteMenuType(v)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={AddMenuType()}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	//添加/编辑目录分类
	const AddMenuType = useCallback(
		(item?: MenuTypeItem) => () => {
			ModalCustom({
				content: AddMenuTypeItemModel,
				params: { item }
			})
		},
		[]
	)
	//删除
	const deleteMenuType = (id: number) => () => {
		Modal.confirm({
			title: "删除",
			content: "是否删除该记录？",
			closable: true,
			onOk: () => {
				serviceManage.deleteMenuType({ id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doMenuListModel")
						Modal.destroyAll()
						message.success("删除成功")
					}
				})
			}
		})
	}
	return (
		<Card
			style={{ width: 630 }}
			title="目录分类"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<ListTable
				pageSize={50}
				title={titleRender}
				searchParams={{ ...params }}
				columns={returnColumnFields(["MenuTypeName", "MenuTypeSort"]).concat(columns)}
				apiService={serviceManage.getMenuType}
			/>
		</Card>
	)
}

export default MenuTypeListModel
