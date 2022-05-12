import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Row, Col } from "antd"
import React, { ReactText, useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "../modal.context"
import { returnColumnFields } from "@/utils/column.fields"
import "./relatProduct.modal.less"
import ListTable from "@/components/utils/list.table"
import serviceData from "@/services/service.data"
import { ProductItem } from "@/interfaces/api.interface"
import FormSearch from "@/components/form/form.search"
interface Props {
	id?: string
	data: ProductItem[]
}
const RelatProductModal: React.FC<Props & ModalRef<ProductItem[]>> = props => {
	const { modalRef, resolve, data } = props
	const [hasSelected, setHasSelected] = useState({
		keys: data.map(m => m.productId) as ReactText[],
		data: data || []
	})
	const oldData = useRef([...props.data])
	const closeModal = useCallback(() => {
		resolve(data)

		modalRef.current.destroy()
	}, [resolve])
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const saveRelatProduct = useCallback(() => {
		const newData = hasSelected.data.filter(m => !!m)
		const newDataKey = newData.map(m => m.productId || m.id)
		resolve(
			oldData.current
				.filter(m => hasSelected.keys.includes(m.productId) && !newDataKey.includes(m.productId))
				.concat(
					newData.map(m => ({
						id: m.id + new Date().getTime(),
						productId: m.productId || m.id,
						title: m.title,
						solutionId: 0,
						model: m.model,
						image: m.image
					}))
				)
		)
		modalRef.current.destroy()
	}, [hasSelected])
	return (
		<Card
			id="relatProductBox"
			style={{ width: 900 }}
			title={"添加产品"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<FormSearch fields={[{ type: "text", title: "名称", name: "key" }]} toSearch={setParams} />
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						expandable={{
							defaultExpandedRowKeys: new Array(999).fill("").map((m, index) => index)
						}}
						rowSelection={{
							selectedRowKeys: hasSelected.keys,
							preserveSelectedRowKeys: true,
							onChange: (newKeys, newData) => {
								setHasSelected({ keys: newKeys, data: newData })
							}
						}}
						searchParams={params}
						columns={returnColumnFields([
							"sort",
							"productName",
							"productModel",
							"productType",
							"dataStatus",
							"creatorName",
							"createDate"
						])}
						apiService={serviceData.getProductData}
					/>
				</Col>
			</Row>
			<div style={{ textAlign: "right" }}>
				<Button type="primary" onClick={saveRelatProduct}>
					保存
				</Button>
				<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
					取消
				</Button>
			</div>
		</Card>
	)
}

export default RelatProductModal
