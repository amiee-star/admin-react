import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, message, DatePicker, Modal, Form } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import AddFlowpathModal from "@/components/modal/manage/addFlowpath.modal"
import UpdateExhibitionInfo from "@/components/modal/manage/updateExhibitionInfo.modal"
import "moment/locale/zh-cn"
import { useForm } from "antd/lib/form/Form"
import serviceManage from "@/services/service.manage"
import moment from "moment"

const FlowpathMedia = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const { RangePicker } = DatePicker
	const [form] = useForm()
	useEffect(() => {
		withParams.current = params
	}, [params])

	const toResethandle = () => {
		setParams({})
		form.setFields([
			{
				name: "time",
				value: ""
			}
		])
	}

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
						<Button size="middle" type="primary" danger onClick={deleteFlowpath(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	//时间筛选查询
	const onFinish = (values: { startTime: string; endTime: string; time: [] }) => {
		values.startTime = moment(new Date(values["time"][0])).format("YYYY-MM-DD") + " 00:00:00"
		values.endTime = moment(new Date(values["time"][1])).format("YYYY-MM-DD") + " 23:59:59"
		values.time = []
		setParams(values)
	}

	// 删除展会流程
	const deleteFlowpath = (id: string) => () => {
		Modal.confirm({
			title: "删除流程",
			content: "是否删除该流程？",
			closable: true,
			onOk: () => {
				serviceManage.deleteFlowpath({ id, exhibitionId: props.location.query.exhibitionId }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doFlowpathList")
						Modal.destroyAll()
						message.success("删除成功")
					}
				})
			}
		})
	}
	// 创建展会流程
	const handle = (id: string) => () => {
		ModalCustom({
			content: AddFlowpathModal,
			params: {
				id
			}
		})
	}

	//编辑展会信息
	const updataExhibitionInfo = (exhibitionId: string) => () => {
		ModalCustom({
			content: UpdateExhibitionInfo,
			params: {
				id: props.location.query.exhibitionId
			}
		})
	}
	// 抛出事件
	useEffect(() => {
		eventBus.on("doFlowpathList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doFlowpathList")
		}
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={updataExhibitionInfo(String(props.location.query.exhibitionId))}>
							展会信息编辑
						</Button>
						<Button style={{ marginLeft: 30 }} type="primary" onClick={handle("")}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<div id="flowpath">
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<Form form={form} onFinish={onFinish}>
						<Form.Item
							name="time"
							label={"时间范围:"}
							style={{ display: "inline-flex", width: "calc(20% - 4px)", marginLeft: 20 }}
						>
							<RangePicker />
						</Form.Item>
						<Button type="primary" htmlType="submit" style={{ marginLeft: 15 }}>
							查询
						</Button>
						<Button type="default" onClick={toResethandle} htmlType="reset" style={{ marginLeft: 15 }}>
							重置
						</Button>
					</Form>
				</Col>

				<Col className="form-result" span={24}>
					<ListTable
						title={titleRender}
						searchParams={{ exhibitionId: props.location.query.exhibitionId, ...params }}
						columns={returnColumnFields(["sort", "timeQuantum", "proposition", "creatorName", "createDate"]).concat(
							columns
						)}
						//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
						// dataSource={dataSource}
						apiService={serviceManage.getFlowpathList}
					/>
				</Col>
			</Row>
		</div>
	)
}
FlowpathMedia.title = "展会流程"
export default FlowpathMedia
