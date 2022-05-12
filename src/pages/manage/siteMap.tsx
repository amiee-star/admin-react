import { PageProps } from "@/interfaces/app.interface"
import React, { useMemo, useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, message, Modal } from "antd"

import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"

import AddsiteMapModal from "@/components/modal/manage/addsiteMap.modal"
import serviceManage from "@/services/service.manage"
import Sharesite from "@/components/modal/manage/shareSite"
import AddHotBackModel from "@/components/modal/manage/addHotBack.modal"
import MenuTypeListModel from "@/components/modal/manage/MenuTypeList.modal"

const SiteMapMedia = (props: PageProps) => {
	const [params, setParams] = useState({ pageSize: 50, currentPage: 1 })
	const withParams = useRef<any>()
	const needData = useRef<any[]>([])
	const pageIndex = useRef(1)
	const [openCount, getOpenCount] = useState(0)
	const [closeCount, getCloseCount] = useState(0)
	const [selectItem, setSelectItem] = useState<{ [key: number]: any[] }>({})
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
						<Button size="middle" type="primary" onClick={shareSite(item.id, item.industryName, item.state)}>
							2.5D网址
						</Button>
						<Button size="middle" type="primary" onClick={handle(item.id)}>
							编辑
						</Button>
					</Space>
				)
			}
		}
	]

	// 创建编辑合作媒体
	const handle = (id: string) => () => {
		ModalCustom({
			content: AddsiteMapModal,
			params: {
				id
			}
		})
	}
	// 创建编辑合作媒体
	const shareSite = (id: string, industryName: string, state: Boolean) => () => {
		ModalCustom({
			content: Sharesite,
			params: {
				id,
				industryName,
				state
			}
		})
	}
	//批量处理
	const batchSwitch = useCallback(
		(state: number) => () => {
			let data: any[] = []
			Object.values(needData.current).forEach(m => {
				data = data.concat(m)
			})

			let listId = data.map(m => m.id)
			if (data.length == 0) {
				Modal.confirm({
					title: "请至少勾选一条数据",
					onOk: () => {
						Modal.destroyAll()
					}
				})
			} else {
				Modal.confirm({
					title: state == 0 ? "批量关闭热点" : "批量开启热点",
					content: state == 0 ? "是否关闭所有勾选热点？" : "是否开启所有勾选热点",
					closable: true,
					onOk: () => {
						serviceManage
							.updateSiteMapList({ listId, state, exhibitionId: props.location.query.exhibitionId })
							.then(res => {
								if (res.code === 200) {
									eventBus.emit("doSiteMapList")
									eventBus.emit("doStateNumber")
									setSelectItem({})
									Modal.destroyAll()
									message.success(state == 0 ? "已关闭所有勾选热点" : "已开启所有勾选热点")
								}
							})
					}
				})
			}
		},
		[selectItem]
	)

	const initCount = useCallback(() => {
		serviceManage.getSiteMapList({ exhibitionId: props.location.query.exhibitionId, state: 0 }).then(res => {
			getCloseCount(res.data.count)
		})
		serviceManage.getSiteMapList({ exhibitionId: props.location.query.exhibitionId, state: 1 }).then(res => {
			getOpenCount(res.data.count)
		})
	}, [])

	//热点背景图
	const hotBack = useCallback(() => {
		ModalCustom({
			content: AddHotBackModel
		})
	}, [])
	// 目录分类
	const menuTypeEdit = useCallback(() => {
		ModalCustom({
			content: MenuTypeListModel
		})
	}, [])
	// 抛出事件
	useEffect(() => {
		initCount()
		eventBus.on("doSiteMapList", () => setParams({ ...withParams.current }))
		eventBus.on("doStateNumber", () => {
			initCount()
		})
		return () => {
			eventBus.off("doSiteMapList")
			eventBus.off("doStateNumber")
		}
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={hotBack}>
							+热点背景图
						</Button>
						<Button type="primary" onClick={menuTypeEdit}>
							+目录分类
						</Button>
						<Button type="primary" onClick={batchSwitch(0)}>
							批量关闭
						</Button>
						<Button type="primary" onClick={batchSwitch(1)}>
							批量开启
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	const selectChange = useCallback(
		(selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
			let dataLength = 0
			const hasData = { ...selectItem }
			hasData[pageIndex.current] = selectedRows
			Object.values(hasData).forEach(m => {
				dataLength = dataLength + m.length
			})
			hasData[pageIndex.current] = selectedRows
			setSelectItem(hasData)
		},
		[selectItem]
	)

	const selectKeys = useMemo(() => {
		needData.current = []
		Object.values(selectItem).forEach(m => {
			needData.current = needData.current.concat(m)
		})
		return needData.current.map(m => m.id)
	}, [selectItem])
	return (
		<div id="siteMap">
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<Space>
						<div style={{ paddingBottom: 10 }}>
							<span>热点:已开启{openCount}个</span>
							<span style={{ marginLeft: 15 }}>已关闭{closeCount}个</span>
						</div>
						<FormSearch fields={returnSearchFiels(["hotspotStatus"])} toSearch={setParams} />
					</Space>
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						pageSize={50}
						title={titleRender}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields(["industry", "displayStatus", "siteMapSort", "hotspotName"]).concat(columns)}
						apiService={serviceManage.getSiteMapList}
						rowSelection={{
							selectedRowKeys: selectKeys,
							onChange: selectChange
						}}
					/>
				</Col>
			</Row>
		</div>
	)
}
SiteMapMedia.title = "3D导览岛设置"
export default SiteMapMedia
