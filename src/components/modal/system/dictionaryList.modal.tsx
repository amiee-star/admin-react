import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Modal, Row, Space } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceSys from "@/services/service.sys"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/lib/table"
import AddDicItemModal from "./addDicItem.modal"
interface Props {
	id: string
}
const DictionaryListModel: React.FC<Props & ModalRef> = props => {
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
		eventBus.on("doDictionaryListModel", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doDictionaryListModel")
		}
	}, [])
	const addSubject = useCallback(
		(id: string) => () => {
			ModalCustom({
				content: AddDicItemModal,
				params: {
					id,
					edit: null,
					ids: null,
					item: null
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
					serviceSys.delDictionaryItem([id]).then(res => {
						if (res.code === 200) {
							eventBus.emit("doDictionaryListModel")
							Modal.destroyAll()
						} else {
							message.error(res.msg)
						}
					})
				}
			})
		},
		[]
	)
	// 创建编辑字典项
	const addDictionary = useCallback(
		item => () => {
			ModalCustom({
				content: AddDicItemModal,
				params: {
					ids: item.id,
					edit: 1,
					id: props.id,
					item
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
						<Button size="middle" type="primary" onClick={addDictionary(item)}>
							编辑
						</Button>
						<Button size="middle" type="primary" danger onClick={deleteDictionary(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	return (
		<Card
			id="dictionaryList"
			style={{ width: 980 }}
			title="字典项列表"
			extra={
				<Space>
					<Button type="primary" onClick={addSubject(props.id)}>
						添加
					</Button>
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				</Space>
			}
		>
			<Row className="data-form full">
				<Col className="form-result" span={24}>
					<ListTable
						searchParams={{ ...params, dictType: props.id }}
						columns={returnColumnFields([
							"sort",
							"dictionaryItemKey",
							"dictionaryItemValue",
							"dictionaryItemRemark"
						]).concat(columns)}
						//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
						apiService={serviceSys.getDictionaryItem}
					/>
				</Col>
			</Row>
		</Card>
	)
}

export default DictionaryListModel
