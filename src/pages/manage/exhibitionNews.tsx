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
import AddExhibitionNewsmodal from "@/components/modal/manage/addExhibitionNews.modal"
import serviceManage from "@/services/service.manage"

const ExhibitionNewsMedia = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		eventBus.on("doExhibitionNewsList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doExhibitionNewsList")
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
						<Button size="middle" type="primary" danger onClick={deleteExhibitionNews(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 删除新闻
	const deleteExhibitionNews = (id: string) => () => {
		Modal.confirm({
			title: "删除新闻",
			content: "是否删除该新闻？",
			closable: true,
			onOk: () => {
				serviceManage.deleteExhibitionNews({ id, exhibitionId: props.location.query.exhibitionId }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doExhibitionNewsList")
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
			content: AddExhibitionNewsmodal,
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
		<div id="exhibitionNews">
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<FormSearch fields={returnSearchFiels(["exhibitionNewsSearch"])} toSearch={setParams} />
				</Col>
				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields([
							"infoTitle",
							"infoPhoto",
							"exhibitionSort",
							"infoTime",
							"creatorName",
							"createDate"
						]).concat(columns)}
						//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
						apiService={serviceManage.getExhibitionNewsList}
					/>
				</Col>
			</Row>
		</div>
	)
}
ExhibitionNewsMedia.title = "展会新闻"
export default ExhibitionNewsMedia
