import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, InputNumber, message, Row, Col, Space } from "antd"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import limitNumber from "@/utils/checkNum.func"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import serviceManage from "@/services/service.manage"
import urlFunc from "@/utils/url.func"
import Item from "antd/lib/list/Item"
import { previewInvitaion } from "@/interfaces/api.interface"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import columnFields, { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/lib/table/interface"
import lsFunc from "@/utils/ls.func"

interface Props {
	invitationId: string
}
interface ColumnData {
	key: string
	name: string
	placeholder: string
	rules: string
	type: string
	isRequired: boolean
	children: ColumnData
}
let mark = true
const JoinDetailInvitationModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, invitationId } = props
	const [form] = Form.useForm()
	const exhibitionId = location.search.split("exhibitionId=")[1]
	const [params, setParams] = useState({})
	const [columnData, setColumnData] = useState<ColumnData[]>([])
	const withParams = useRef<any>()
	const [done, setDone] = useState(false)
	useEffect(() => {
		withParams.current = params
	}, [params])

	// 抛出事件
	useEffect(() => {
		eventBus.on("doSome", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSome")
		}
	}, [])
	// 获取报名页字段
	useEffect(() => {
		serviceManage.registrationFieldsInvitation({ id: invitationId }).then(res => {
			if (res.code == 200) {
				setColumnData(JSON.parse(res.data))
				setDone(true)
			} else {
				setDone(true)
			}
		})
	}, [])

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const exportExcel = useCallback(() => {
		window.open(
			`${urlFunc.getHost(
				"api"
			)}/exhibition/invitation/exportRegistration?invitationId=${invitationId}&token=${lsFunc.getItem("token")}`
		)
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={exportExcel}>
							导出Excel
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	const columns: ColumnType<any>[] = useMemo(() => {
		return columnData.map(item => {
			return {
				title: item.name,
				dataIndex: item.key,
				key: item.key,
				align: "center"
			}
		})
	}, [columnData])

	return (
		<Card
			style={{ width: 900 }}
			title="人员明细"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row className="data-form full" justify="center">
				<Col className="form-search" span={24}>
					<FormSearch fields={returnSearchFiels(["renyuankeyword", "signUpRange"])} toSearch={setParams} />
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={{ ...params, invitationId }}
						columns={returnColumnFields(["sort"]).concat(columns)}
						//
						apiService={serviceManage.registrationListInvitation}
						transformData={data => {
							let arr = []
							data.map(item => {
								arr.push(JSON.parse(item.info))
							})
							return arr
						}}
					/>
				</Col>
				<Col span={2} style={{ marginTop: "20px" }}>
					<Button type="primary" onClick={closeModal}>
						确定
					</Button>
				</Col>
			</Row>
		</Card>
	)
}

export default JoinDetailInvitationModel
