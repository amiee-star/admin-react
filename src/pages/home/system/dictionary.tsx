import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, Modal } from "antd"
import serviceSys from "@/services/service.sys"
import { returnColumnFields } from "@/utils/column.fields"
import AddDictionary from "@/components/modal/system/addDictionary.modal"
import DictionaryListModel from "@/components/modal/system/dictionaryList.modal"

const Dictionary = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const pageIndex = useRef(1)
	const [list, setList] = useState([])
	const exportIndex = useCallback((index: number) => {
		pageIndex.current = index
	}, [])
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
						<Button size="middle" type="primary" onClick={addDictionary(item)}>
							编辑
						</Button>
						{/* <Popconfirm placement="left" title="确认删除该字典?" onConfirm={deleteFile1(item)}> */}
						<Button size="middle" type="primary" danger onClick={deleteDictionary(item.id)}>
							删除
						</Button>
						{/* </Popconfirm> */}
						<Button
							size="middle"
							type="primary"
							style={{ backgroundColor: "#05B7B7" }}
							onClick={manageSubject(item.id)}
						>
							字典项
						</Button>
					</Space>
				)
			}
		}
	]
	const manageSubject = useCallback(
		(id: string) => () => {
			ModalCustom({
				content: DictionaryListModel,
				params: {
					id
				}
			})
		},
		[]
	)
	// 删除字典
	const deleteDictionary = useCallback(
		(id: string) => () => {
			Modal.confirm({
				title: "删除字典",
				content: "是否删除该字典？",
				closable: true,
				onOk: () => {
					if (list.length === 1 && pageIndex.current > 1) {
						pageIndex.current = pageIndex.current - 1
					}
					serviceSys.delDictionaryList([id]).then(res => {
						if (res.code === 200) {
							eventBus.emit("doDictionary")
							Modal.destroyAll()
						}
					})
				}
			})
		},
		[list]
	)
	// 创建编辑字典
	const addDictionary = useCallback(
		(item: {}) => () => {
			ModalCustom({
				content: AddDictionary,
				params: {
					item
				}
			})
		},
		[]
	)
	// 抛出事件
	useEffect(() => {
		eventBus.on("doDictionary", () => setParams({ ...withParams.current, pageNum: pageIndex.current }))
		return () => {
			eventBus.off("doDictionary")
		}
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>字典列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addDictionary("")}>
							新增字典
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	return (
		<Row className="data-form full">
			{/* <Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels([])} toSearch={setParams} />
			</Col> */}
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					exportIndex={exportIndex}
					searchParams={params}
					exportData={list => {
						setList(list)
					}}
					columns={returnColumnFields(["sort", "dictionaryName", "dictionaryType"]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.getDictionaryList}
				/>
			</Col>
		</Row>
	)
}
Dictionary.title = "字典管理"
export default Dictionary
