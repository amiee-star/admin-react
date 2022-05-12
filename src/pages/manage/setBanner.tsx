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
import AddBanner from "@/components/modal/manage/addBanner.modal"
import serviceManage from "@/services/service.manage"
import OtherBannerModel from "@/components/modal/manage/otherBanner.modal"

const SetBannerMedia = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		eventBus.on("doBannerList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doBannerList")
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
						<Button size="middle" type="primary" danger onClick={deleteBanner(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 删除Banner
	const deleteBanner = (id: number) => () => {
		Modal.confirm({
			title: "删除Banner",
			content: "是否删除该Banner？",
			closable: true,
			onOk: () => {
				serviceManage.deleteExhibitionBanner({ id, exhibitionId: props.location.query.exhibitionId }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doBannerList")
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
			content: AddBanner,
			params: {
				id
			}
		})
	}
	const hightlightBanner = (type: number) => () => {
		ModalCustom({
			content: OtherBannerModel,
			params: {
				type
			}
		})
	}

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space style={{ marginRight: "10px" }}>
						<Button type="primary" onClick={hightlightBanner(1)}>
							聚焦精彩
						</Button>
					</Space>
					<Space style={{ marginRight: "10px" }}>
						<Button type="primary" onClick={hightlightBanner(2)}>
							新闻资讯
						</Button>
					</Space>
					<Space>
						<Button type="primary" onClick={handle()}>
							+首页Banner
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<div id="setBanner">
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<FormSearch fields={returnSearchFiels(["setBannerSearch"])} toSearch={setParams} />
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields([
							"sort",
							"setBannerCover",
							"setBannerName",
							"setBannerLink",
							"setBannerSort"
						]).concat(columns)}
						apiService={serviceManage.getExhibitionBannerList}
					/>
				</Col>
			</Row>
		</div>
	)
}
SetBannerMedia.title = "Banner设置"
export default SetBannerMedia
