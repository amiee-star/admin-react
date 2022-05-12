import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { Row, Col, Space, Button, Modal } from "antd"
import serviceSys from "@/services/service.sys"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import { ModalCustom } from "@/components/modal/modal.context"
import AddInvitationmodal from "@/components/modal/manage/addInvitation.modal"
import { ColumnType } from "antd/lib/table"
import ProxyConfig from "@/../config/proxy"
import serviceManage from "@/services/service.manage"
import ContentEditModal from "@/components/modal/manage/contentEdit.modal"
import PreviewInvitationModel from "@/components/modal/manage/previewInvitaion.modal"
import ShareInvitationModel from "@/components/modal/manage/shareInvitation.modal"
import InvitationCardModel from "@/components/modal/manage/invitationCard.modal"
const Sign = (props: PageProps) => {
	const [params, setParams] = useState({})

	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])

	// 抛出事件
	useEffect(() => {
		eventBus.on("doInvitation", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doInvitation")
		}
	}, [])

	// 创建邀请函
	const AddInvitation = () => {
		ModalCustom({
			content: AddInvitationmodal
			// params: {}
		})
	}
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={AddInvitation}>
							+ 创建邀请函
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	const EditContent = useCallback(
		(id, copy?: boolean) => () => {
			ModalCustom({
				content: ContentEditModal,
				params: { id, copy }
			})
		},
		[]
	)
	const PreviewInvitation = useCallback(
		id => () => {
			ModalCustom({
				content: PreviewInvitationModel,
				params: { id }
			})
		},
		[]
	)
	const PublishInvitation = useCallback(
		item => () => {
			Modal.confirm({
				title: !item.state ? "发布后将生成邀请函短地址及二维码" : "重新发布将覆盖原有邀请函页面数据",
				content: !item.state ? "是否确认发布？" : "是否确认发布？",
				closable: true,
				onOk: () => {
					serviceManage.publishInvitation({ id: item.id }).then(res => {
						if (res.code == 200) {
							eventBus.emit("doInvitation")
						}
					})
				}
			})
		},
		[]
	)
	const ShareInvitation = useCallback(
		id => () => {
			ModalCustom({
				content: ShareInvitationModel,
				params: { id }
			})
		},
		[]
	)
	const InvitationCard = useCallback(
		id => () => {
			ModalCustom({
				content: InvitationCardModel,
				params: { id }
			})
		},
		[]
	)

	const EnableInvitation = useCallback(
		id => () => {
			serviceManage.enableInvitation({ id }).then(res => {
				if (res.code == 200) {
					eventBus.emit("doInvitation")
				}
			})
		},
		[]
	)

	const DisableInvitation = useCallback(
		id => () => {
			serviceManage.disableInvitation({ id }).then(res => {
				if (res.code == 200) {
					eventBus.emit("doInvitation")
				}
			})
		},
		[]
	)

	const DeleteInvitation = useCallback(
		id => () => {
			Modal.confirm({
				title: "确认删除",
				content: "是否删除该数据？",
				closable: true,
				onOk: () => {
					serviceManage.deleteInvitation({ id }).then(res => {
						if (res.code == 200) {
							eventBus.emit("doInvitation")
						}
					})
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
			width: 350,
			align: "center",
			render: (v: any, item: any) => {
				return (
					<Space size={10}>
						<Button size="small" type="primary" onClick={EditContent(item.id)} disabled={item.state == 2}>
							编辑
						</Button>
						<Button
							size="small"
							type="primary"
							onClick={PreviewInvitation(item.id)}
							disabled={item.state == 2 || item.state == 2}
						>
							预览
						</Button>
						<Button size="small" type="primary" onClick={PublishInvitation(item)} disabled={item.state == 2}>
							发布
						</Button>
						<Button
							size="small"
							type="primary"
							onClick={ShareInvitation(item.id)}
							disabled={item.state == 0 || item.state == 2}
						>
							分享
						</Button>
						<Button
							size="small"
							type="primary"
							onClick={InvitationCard(item.id)}
							disabled={item.state == 0 || item.state == 2}
						>
							邀请卡
						</Button>

						{item.state == 1 ? (
							<Button size="small" type="primary" onClick={DisableInvitation(item.id)}>
								禁用
							</Button>
						) : (
							<Button size="small" type="primary" onClick={EnableInvitation(item.id)} disabled={item.state == 0}>
								启用
							</Button>
						)}

						<Button size="small" type="primary" onClick={EditContent(item.id, true)}>
							复制
						</Button>
						<Button size="small" type="primary" danger onClick={DeleteInvitation(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["invitKeyword", "invitStatus"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"invitationName",
						"templateName",
						"templateState",
						"joinNum",
						"creatorName",
						"createDate"
					]).concat(columns)}
					apiService={serviceManage.getInvitationList}
				/>
			</Col>
		</Row>
	)
}
Sign.title = "邀请函"
export default Sign
