import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, message, Modal } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import AddPartnerModal from "@/components/modal/manage/addPartner.modal"
import serviceManage from "@/services/service.manage"

const PartnerMedia = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		eventBus.on("doPartnerList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doPartnerList")
		}
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
						<Button size="middle" type="primary" onClick={handle(item.id)}>
							编辑
						</Button>
						<Button size="middle" type="primary" danger onClick={deletePartner(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 删除合作媒体
	const deletePartner = (id: string) => () => {
		Modal.confirm({
			title: "删除媒体",
			content: "是否删除该媒体？",
			closable: true,
			onOk: () => {
				serviceManage.deletePartner({ id, exhibitionId: props.location.query.exhibitionId }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doPartnerList")
						Modal.destroyAll()
						message.success("删除成功")
					}
				})
			}
		})
	}
	// 创建编辑合作媒体
	const handle = (id: string) => () => {
		ModalCustom({
			content: AddPartnerModal,
			params: {
				id
			}
		})
	}

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle("")}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<div id="partner">
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<FormSearch fields={returnSearchFiels(["partnerSearch"])} toSearch={setParams} />
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields(["mediaName", "mediaLogo", "mediaSort", "creatorName", "createDate"]).concat(
							columns
						)}
						apiService={serviceManage.getPartnerList}
					/>
				</Col>
			</Row>
		</div>
	)
}
PartnerMedia.title = "合作媒体"
export default PartnerMedia
