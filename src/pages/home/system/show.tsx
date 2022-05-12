import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, message, Modal } from "antd"
import serviceSys from "@/services/service.sys"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import ShowFunction from "@/components/modal/system/showFunction.modal"
import ShowInfo from "@/components/modal/system/showInfo.modal"
import "./show.less"

const ShowManage = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const [selectItem, setSelectItem] = useState([])
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
						<Button size="middle" type="primary" onClick={showInfo(item.id)} style={{ backgroundColor: "#05B7B7" }}>
							基础信息
						</Button>
						<Button size="middle" type="primary" onClick={functionSet(item.id)}>
							功能配置
						</Button>
						<Button size="middle" type="primary" danger onClick={deleteShow(item.id, item.webState)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 删除展会
	const deleteShow = (id: string, webState: number) => () => {
		if (!webState) {
			Modal.confirm({
				title: "删除展会",
				content: "是否删除该展会？",
				closable: true,
				onOk: () => {
					serviceSys.delExhibitionList([id]).then(res => {
						if (res.code === 200) {
							eventBus.emit("doShowInfo")
							Modal.destroyAll()
						}
					})
				}
			})
		} else {
			message.error("请先下架后再删除")
		}
	}
	// 创建 编辑展会信息
	const showInfo = (id: string) => () => {
		ModalCustom({
			content: ShowInfo,
			params: {
				id
			}
		})
	}
	const selectShow = useRef([])
	const selectChange = useCallback(
		(selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
			setSelectItem(selectedRowKeys)
			selectShow.current = selectedRowKeys
		},
		[selectItem]
	)
	//设置默认
	const setDefault = (id: string) => () => {
		if (!selectShow.current[0]) {
			message.info("请先勾选一条展会数据")
		} else {
			serviceSys.setDefaultShow({ id: selectShow.current[0] }).then(res => {
				if (res.code === 200) {
					eventBus.emit("doShowInfo")
					message.success("成功设置默认展会")
					setSelectItem([])
					selectShow.current = []
				}
			})
		}
	}
	// 展会显示功能配置
	const functionSet = (id: string) => () => {
		ModalCustom({
			content: ShowFunction,
			params: {
				id
			}
		})
	}
	// 抛出事件
	useEffect(() => {
		eventBus.on("doShowInfo", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doShowInfo")
		}
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>展会列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={showInfo("")}>
							创建展会
						</Button>
						<Button type="primary" onClick={setDefault("")}>
							设为默认
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	const pageIndex = useRef(1)
	const exportIndex = useCallback((index: number) => {
		pageIndex.current = index
	}, [])
	return (
		<Row className="data-form full showstyle">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["showKeyword", "showStatus", "showWebStatus", "showIsDef", "showTimes"])}
					toSearch={setParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					exportIndex={exportIndex}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"showName",
						"showTime",
						"showTrade",
						"showStatus",
						"webState",
						"isDefaultShow"
					]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.getExhibitionList}
					rowSelection={{
						selectedRowKeys: selectItem,
						onChange: selectChange,
						type: "radio"
					}}
				/>
			</Col>
		</Row>
	)
}
ShowManage.title = "展会管理"
export default ShowManage
