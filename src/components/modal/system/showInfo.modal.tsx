import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select, DatePicker, message, List, Row, Col } from "antd"
import React, { useCallback, useEffect, useRef } from "react"
import { ModalCustom, ModalRef } from "../modal.context"
import serviceSys from "@/services/service.sys"
import serviceData from "@/services/service.data"
import eventBus from "@/utils/event.bus"
import { useState } from "react"
import toTime from "@/utils/checkParamsTime"
import moment from "moment"
import { debounce } from "lodash"
import AddMapModal from "./addMapModal"
import { Sign } from "@/interfaces/api.interface"

interface Props {
	id: string
}
let mark = true
const showFunctionModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const { Option } = Select
	const { RangePicker } = DatePicker
	const [done, setDone] = useState(false)
	const [tradeClassOne, setTradeClassOne] = useState([])
	const [users, setUsers] = useState([])
	const [mapData, setMapData] = useState<Sign[]>([])
	const showState = [
		{ id: 0, title: "未开始" },
		{ id: 1, title: "进行中" },
		{ id: 2, title: "已结束" }
	]

	const addMapPoint = () => {
		ModalCustom({
			content: AddMapModal,
			params: {
				mapData,
				setMapData
			}
		})
	}
	const deleteMapPoint = useCallback(
		id => () => {
			let arr = mapData.filter(item => item.id != id)

			setMapData(arr)
		},
		[mapData]
	)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	// 初始加载获取一级分类
	useEffect(() => {
		serviceData.getTradeClass({ pid: 0 }).then(res => {
			setTradeClassOne(res.data)
		})
		getUsers("")
	}, [])
	const getUsers = (name: string) => {
		serviceSys.getUserList({ pageSize: 999, userName: name }).then(res => {
			setUsers(res.data.entities)
		})
	}

	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false

			const params = {
				title: data.title,
				startTime: moment(new Date(data["time"][0])).format("YYYY-MM-DD HH:mm:ss"),
				endTime: moment(new Date(data["time"][1])).format("YYYY-MM-DD HH:mm:ss"),
				listUserId: data.listUserId,
				state: data.state,
				listIndustryId: data.listIndustryId,
				remarks: data.remarks,
				id: !!props.id ? props.id : undefined,
				listSign: mapData,
				singFlag: 1
			}
			serviceSys[!!props.id ? "editExhibitionList" : "addExhibitionList"](params)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doShowInfo")
						form.resetFields()
						closeModal()
						message.success(!!props.id ? "编辑成功" : "新增成功")
					} else {
						message.error(res.msg)
					}
				})
				.finally(() => {
					mark = true
				})
		},
		[mapData]
	)

	useEffect(() => {
		if (props.id) {
			serviceSys.getExhibition({ id: props.id }).then(res => {
				if (res.code === 200) {
					const admins: any[] = []
					const listIndustryId: any[] = []
					if (!!res.data.listAdmin) {
						res.data.listAdmin.forEach((item: { userId: any }) => {
							admins.push(item.userId)
						})
					}
					if (!!res.data.listExhibitionIndustry) {
						res.data.listExhibitionIndustry.forEach((item: { industryId: any }) => {
							listIndustryId.push(item.industryId)
						})
					}
					if (!!res.data.listSign) {
						setMapData(res.data.listSign)
					}
					form.setFieldsValue({
						...res.data,
						title: res.data.title,
						time: [
							res.data.startTime ? moment(res.data.startTime) : null,
							res.data.endTime ? moment(res.data.endTime) : null
						],
						state: res.data.state,
						remarks: res.data.remarks,
						listUserId: admins,
						listIndustryId: listIndustryId
					})

					setDone(true)
				} else {
					message.error(res.msg)
				}
			})
		} else {
			setDone(true)
		}
	}, [props.id])
	const timeArr = useRef<any>([])
	const onChange = (value: any, dateString: any) => {
		!!dateString &&
			dateString.forEach((val: string) => {
				timeArr.current.push(toTime(val))
			})
	}
	// 前置任务列表搜索
	const handleSearchName = debounce(value => {
		// fetchFrontList(value)

		getUsers(value)
	}, 200)
	return (
		done && (
			<Card
				style={{ width: 630 }}
				title={props.id == "" ? "基础信息新增" : "基础信息编辑"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				{/* {!!data && ( */}
				<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false} onFinish={onFinish}>
					<Form.Item
						label="展会名称："
						name="title"
						rules={[
							{ required: true, message: "请输入展会名称名称" },
							{ message: "请输入1-50个文字", max: 50 }
						]}
					>
						<Input placeholder="请输入展会名称（最多50个字符）" />
					</Form.Item>
					<Form.Item label="时间：" name="time" rules={[{ required: true, message: "请选择展会时间" }]}>
						<RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" onChange={onChange} />
					</Form.Item>
					<Form.Item label="展会行业" name="listIndustryId" rules={[{ required: true, message: "请选择展会行业" }]}>
						<Select placeholder={"选择展会行业"} mode="multiple">
							{tradeClassOne.map(item => (
								<Option key={item.id} value={item.id}>
									{item.title}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="展会状态：" name="state" rules={[{ required: true, message: "请输入展会状态" }]}>
						<Select placeholder={"选择展会状态"}>
							{showState.map(item => (
								<Option key={item.id} value={item.id}>
									{item.title}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="展会联系人" name="listUserId">
						<Select placeholder={"选择展会联系人"} mode="multiple" onSearch={handleSearchName} allowClear>
							{users.map(item => (
								<Option key={item.id} value={item.id}>
									{item.username}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item label="签到设置">
						<Button size="small" onClick={addMapPoint}>
							+添加
						</Button>
					</Form.Item>
					<List
						style={{
							marginLeft: "40px",
							paddingLeft: "5px",
							border: "1px solid #d9d9d9",
							marginBottom: "40px",
							fontSize: "12px"
						}}
						split={false}
						itemLayout="horizontal"
						dataSource={mapData}
						renderItem={item => (
							<List.Item key={item.id} style={{ padding: "0px" }}>
								<span style={{ flexBasis: "90px" }}>{item.locationName}</span>
								<span style={{ flexBasis: "240px", flexGrow: 1 }}>{`${item.address}  ${item.scope}米`}</span>
								<Button size="small" style={{ border: "none" }} onClick={deleteMapPoint(item.id)}>
									删除
								</Button>
							</List.Item>
						)}
					/>
					<Form.Item label="备注" name="remarks">
						<Input.TextArea placeholder="请输入展会信息备注（最多100字）" />
					</Form.Item>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</Form>
				{/* )} */}
			</Card>
		)
	)
}

export default showFunctionModal
