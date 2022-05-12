import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, message, Modal } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import serviceManage from "@/services/service.manage"
import wxConfigureModal from "@/components/modal/manage/wxconfigure.modal"

const ExhibitionPicMedia = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		eventBus.on("doExhibitionPicList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doExhibitionPicList")
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
					</Space>
				)
			}
		}
	]
	// 删除图片
	const deleteExhibitionPic = (id: string) => () => {
		Modal.confirm({
			title: "删除图片",
			content: "是否删除该图片？",
			closable: true,
			onOk: () => {
				serviceManage.deleteExhibitionPic({ id, exhibitionId: props.location.query.exhibitionId }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doExhibitionPicList")
						Modal.destroyAll()
						message.success("删除成功")
					}
				})
			}
		})
	}
	// 创建编辑合作媒体
	const handle = (id?: number) => () => {
		ModalCustom({
			content: wxConfigureModal,
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
						<Button type="primary" onClick={handle()}>
							默认配置
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<div id="exhibitionPic">
			<Row className="data-form full">
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields(["sort", "wxpage", "wxtype", "wxtitle", "wxcontent", "wximage"]).concat(
							columns
						)}
						apiService={serviceManage.getWxShare}
					/>
				</Col>
			</Row>
		</div>
	)
}
ExhibitionPicMedia.title = "微信分享设置"
export default ExhibitionPicMedia
