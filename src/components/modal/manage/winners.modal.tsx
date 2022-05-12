import React, { useCallback, useEffect, useState, useRef } from "react"
import { CloseOutlined, ConsoleSqlOutlined } from "@ant-design/icons"

import { ModalRef } from "../modal.context"
import FormSearch, { FieldItem, OptionItem } from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import serviceManage from "@/services/service.manage"
import { Row, Col, message, Card, Button } from "antd"

interface Props {
	id: string
}

var typeList: OptionItem[] = []

const Winners: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props

	const [selectKeys, setSelectKeys] = useState<React.ReactText[]>([])

	const [done, setDone] = useState<boolean>(false)

	const [params, setParams] = useState({
		activityId: id
	})
	const withParams = useRef<any>()

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		serviceManage.searchAwardsName({ id: id }).then(res => {
			if (res.code === 200) {
				let arr = res.data || []
				arr.map(item => {
					typeList.push({ txt: item.name, value: item.id })
				})
				setDone(true)
			} else {
				message.error(res.msg)
			}
		})

		return () => {
			typeList = []
		}
	}, [])

	const SelectAwards: Array<FieldItem> = [
		{
			name: "awardsId",
			type: "select",
			title: "奖项名称",
			value: "请选择奖项名称",
			data: async () => {
				return typeList
			}
		}
	]

	const clearList = useCallback(() => {
		console.log(selectKeys)
		if (selectKeys.length) {
			serviceManage.deleteWinners({ ids: selectKeys }).then(res => {
				if (res.code === 200) {
					message.success("删除成功")
					setSelectKeys([])
					setParams({ ...withParams.current, ...{ activityId: id } })
				} else {
					message.error(res.msg)
				}
			})
		} else {
			message.info("请选择要删除的数据")
		}
	}, [selectKeys])

	const selectChange = useCallback((selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
		setSelectKeys(selectedRowKeys)
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Button type="primary" onClick={e => clearList()}>
						批量删除
					</Button>
				</Col>
			</Row>
		),
		[selectKeys]
	)

	return (
		<Card
			style={{ width: 800 }}
			title={"中奖名单"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					{done && (
						<FormSearch
							fields={SelectAwards.concat(returnSearchFiels(["winPhone"]))}
							toSearch={setParams}
							defaultParams={{
								activityId: id
							}}
							provideUrl={`/exhibition/activity/winnersPage`}
						/>
					)}
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={params}
						columns={returnColumnFields(["awardsName", "accountName", "mobile"])}
						apiService={serviceManage.getWinners}
						rowSelection={{
							selectedRowKeys: selectKeys,
							onChange: selectChange
						}}
					/>
				</Col>
			</Row>
		</Card>
	)
}

export default Winners
