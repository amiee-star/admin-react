import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, Dropdown, Menu, Popconfirm, Modal } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import serviceSys from "@/services/service.sys"
import addSensitiveModal from "@/components/modal/system/addSensitive.modal"
import SensitiveBatchUploadModal from "@/components/modal/data/sensitivebatchUpload.modal"

const Sensitive = (props: PageProps) => {
	const [params, setParams] = useState({})
	const [list, setList] = useState([])
	const withParams = useRef<any>()
	const pageIndex = useRef(1)

	const exportIndex = useCallback((index: number) => {
		pageIndex.current = index
	}, [])
	const needData = useRef<any[]>([])
	const [selectItem, setSelectItem] = useState<{ [key: number]: any[] }>({})
	const selectChange = useCallback(
		(selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
			let dataLength = 0
			const hasData = { ...selectItem }
			hasData[pageIndex.current] = selectedRows
			Object.values(hasData).forEach(m => {
				dataLength = dataLength + m.length
			})
			// if (!(dataLength > 9)) {
			// const hasData = { ...selectItem }
			hasData[pageIndex.current] = selectedRows
			setSelectItem(hasData)
			// } else {
			// 	message.info("行业数据最多选择10个")
			// }
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
							编辑
						</Button>
						<Button size="middle" type="primary" danger onClick={deleteWord(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 删除敏感词
	const deleteWord = (id: number) => () => {
		Modal.confirm({
			title: "删除敏感词",
			content: "是否删除该敏感词？",
			closable: true,
			onOk: () => {
				if (list.length === 1 && pageIndex.current > 1) {
					pageIndex.current = pageIndex.current - 1
				}
				serviceSys.delSensitive([id]).then(res => {
					if (res.code === 200) {
						eventBus.emit("doSensitive")
						Modal.destroyAll()
					}
				})
			}
		})
	}
	//批量删除敏感词
	const allDelete = useCallback(() => {
		let data: any[] = []
		Object.values(needData.current).forEach(m => {
			data = data.concat(m)
		})

		let params = data.map(m => m.id)
		console.log(params)
		if (data.length == 0) {
			Modal.confirm({
				title: "请至少勾选一条数据",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else {
			Modal.confirm({
				title: "批量删除敏感词",
				content: "是否批量删除敏感词？",
				closable: true,
				onOk: () => {
					//delSensitive(params, "delete")
					serviceSys.delSensitive(params).then(res => {
						if (res.code === 200) {
							eventBus.emit("doSensitive")
							Modal.destroyAll()
						}
					})
				}
			})
		}
	}, [selectItem])
	//批量上传
	const allApload = () => {
		ModalCustom({
			content: SensitiveBatchUploadModal
		})
	}
	// 创建编辑用户
	const handle = (id?: number) => () => {
		ModalCustom({
			content: addSensitiveModal,
			params: {
				id
			}
		})
	}

	// 抛出事件
	useEffect(() => {
		eventBus.on("doSensitive", page => setParams({ ...withParams.current, pageNum: page ? pageIndex.current : null }))
		return () => {
			eventBus.off("doSensitive")
		}
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>用户列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={allDelete}>
							批量删除
						</Button>
						<Button type="primary" onClick={allApload}>
							批量上传
						</Button>
						<Button type="primary" onClick={handle()}>
							添加敏感词
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["sensitiveCreator", "sensitiveType", "sensitiveTime"])}
					toSearch={setParams}
					//isShowExcel={true}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					exportIndex={exportIndex}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"sensitiveType",
						"sensitiveName",
						"sensitiveCreator",
						"sensitiveTime"
					]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.getSensitive}
					rowSelection={{
						selectedRowKeys: selectKeys,
						onChange: selectChange
					}}
					exportData={list => {
						setList(list)
					}}
				/>
			</Col>
		</Row>
	)
}
Sensitive.title = "后台用户"
export default Sensitive
