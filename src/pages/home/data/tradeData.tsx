import { PageProps } from "@/interfaces/app.interface"
import { userContext } from "@/components/provider/user.context"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, Popconfirm, message, Modal, Form, Input, Select, DatePicker } from "antd"
import serviceData from "@/services/service.data"
import { returnColumnFields } from "@/utils/column.fields"
import AddTrade from "@/components/modal/data/addTradeInfo.modal"
import UpdateTrade from "@/components/modal/data/updateTradeInfo.modal"
import { useForm } from "antd/lib/form/Form"
import "./tradeData.less"
import moment from "moment"
import TradebatchUpload from "@/components/modal/data/tradebatchUpload.modal"
import { Creators, TradeClassList } from "@/interfaces/api.interface"
import { deleteTradesParams } from "@/interfaces/params.interface"
const { Option } = Select
const { RangePicker } = DatePicker

const tradeData = (props: PageProps) => {
	const [params, setParams] = useState({})
	const { state, dispatch } = useContext(userContext)

	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const [selectItem, setSelectItem] = useState<{ [key: number]: any[] }>({})

	const selectChange = useCallback((selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
		setSelectItem(selectedRows)
	}, [])

	const needData = useRef<any[]>([])
	const pageIndex = useRef(1)
	const exportIndex = useCallback((index: number) => {
		pageIndex.current = index
	}, [])
	const selectKeys = useMemo(() => {
		needData.current = []
		Object.values(selectItem).forEach(m => {
			needData.current = needData.current.concat(m)
		})
		return needData.current.map(m => m.id)
	}, [selectItem])
	const statResult = useCallback(creatorName => {
		if (state.user && state.user.adminType === 0) {
			if (creatorName !== (state.user && state.user.username)) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
		// return state.user && state.user.adminType === 0 && creatorName !== (state.user && state.user.username)
	}, [])
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
						<Button
							size="middle"
							type="primary"
							ghost={statResult(item.creatorName)}
							onClick={handleUpdate(item.id, item, statResult(item.creatorName))}
							style={{ backgroundColor: "#05B7B7" }}
						>
							{statResult(item.creatorName) ? "查看" : "编辑"}
						</Button>
						<Button size="middle" type="primary" onClick={putAway(item.id)} disabled={statResult(item.creatorName)}>
							上架
						</Button>
						<Button
							size="middle"
							type="primary"
							onClick={downDelete(item.id, "down")}
							disabled={statResult(item.creatorName)}
						>
							下架
						</Button>
						<Button
							size="middle"
							type="primary"
							danger
							onClick={downDelete(item.id, "delete")}
							disabled={statResult(item.creatorName)}
						>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 新增产品信息
	const handleAdd = (id: string) => () => {
		ModalCustom({
			content: AddTrade,
			params: {
				id
			}
		})
	}
	// 编辑产品信息
	const handleUpdate = (id: string, item: {}, stat: boolean) => () => {
		ModalCustom({
			content: UpdateTrade,
			params: {
				id,
				item,
				stat
			}
		})
	}

	// 批量删除
	const allDelete = useCallback(() => {
		let data: any[] = []
		Object.values(needData.current).forEach(m => {
			data = data.concat(m)
		})

		let params = data.map(m => m.id)
		if (data.length == 0) {
			Modal.confirm({
				title: "请至少勾选一条数据",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else if (data.filter(item => statResult(item.creatorName)).length) {
			Modal.confirm({
				title: "存在无操作权限记录,您只能修改自己创建的信息",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else {
			Modal.confirm({
				title: "批量删除行业数据",
				content: "是否删除所有勾选行业数据？",
				closable: true,
				onOk: () => {
					handleDownOrDel(params, "delete")
				}
			})
		}
	}, [selectItem])

	// 批量上架
	const allPutaway = useCallback(() => {
		let data: any[] = []
		Object.values(needData.current).forEach(m => {
			data = data.concat(m)
		})

		let params = data.map(m => m.id)
		if (data.length == 0) {
			Modal.confirm({
				title: "请至少勾选一条数据",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else if (data.filter(item => statResult(item.creatorName)).length) {
			Modal.confirm({
				title: "存在无操作权限记录,您只能修改自己创建的信息",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else {
			Modal.confirm({
				title: "批量上架行业数据",
				content: "是否上架所有勾选行业数据？",
				closable: true,
				onOk: () => {
					upTradeDatas(params)
				}
			})
		}
	}, [selectItem])
	const upTradeDatas = (params: deleteTradesParams) => {
		serviceData.upTradeDatas(params).then(res => {
			if (res.code === 200) {
				message.success("行业数据已成功上架")
				eventBus.emit("doTradeInfo", true)
				setSelectItem({})
				Modal.destroyAll()
			}
		})
	}
	// 批量下架
	const allSoldout = useCallback(() => {
		let data: any[] = []
		Object.values(needData.current).forEach(m => {
			data = data.concat(m)
		})
		let params = data.map(m => m.id)
		if (data.length == 0) {
			Modal.confirm({
				title: "请至少勾选一条数据",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else if (data.filter(item => statResult(item.creatorName)).length) {
			Modal.confirm({
				title: "存在无操作权限记录,您只能修改自己创建的信息",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else {
			Modal.confirm({
				title: "批量下架行业数据",
				content: "是否下架所有勾选行业数据？",
				closable: true,
				onOk: () => {
					handleDownOrDel(params, "down")
				}
			})
		}
	}, [selectItem])

	const handleDownOrDel = (params: deleteTradesParams, key: string) => {
		serviceData[key == "down" ? "downTradeDatas" : "deleteTradeDatas"](params).then(res => {
			if (res.code === 200) {
				if (key == "down") {
					message.success("行业已成功下架")
				} else {
					message.success("行业数据已成功删除")
				}
				eventBus.emit("doTradeInfo", key == "down")
				setSelectItem({})
				Modal.destroyAll()
			} else if (res.code === 1001) {
				message.error(res.msg)
			}
		})
	}
	// 批量上传
	const allApload = () => {
		ModalCustom({
			content: TradebatchUpload
		})
	}
	// 单个删除
	const downDelete = (id: number, type: string) => () => {
		Modal.confirm({
			title: type == "delete" ? "删除该行业数据" : "下架该行业数据",
			content: type == "delete" ? "是否删除该行业数据？" : "是否下架该行业数据？",
			closable: true,
			onOk: () => {
				handleDownOrDel([id], type)
			}
		})
	}
	// 单个上架
	const putAway = (id: number) => () => {
		Modal.confirm({
			title: "上架该行业数据",
			content: "是否上架该行业数据？",
			closable: true,
			onOk: () => {
				upTradeDatas([id])
			}
		})
	}
	// 抛出事件
	useEffect(() => {
		eventBus.on("doTradeInfo", page => setParams({ ...withParams.current, pageNum: page ? pageIndex.current : null }))
		return () => {
			eventBus.off("doTradeInfo")
		}
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={allDelete}>
							批量删除
						</Button>
						<Button type="primary" onClick={allPutaway}>
							批量上架
						</Button>
						<Button type="primary" onClick={allSoldout}>
							批量下架
						</Button>
						<Button type="primary" onClick={allApload}>
							批量上传
						</Button>
						<Button type="primary" onClick={handleAdd("")}>
							新增行业
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	const [form] = useForm()
	// 搜索
	const onFinish = (values: { startTime: string; endTime: string; time: [string, string] }) => {
		if (!!values.time) {
			values.startTime = moment(new Date(values["time"][0])).format("YYYY-MM-DD").concat(" 00:00:00")
			values.endTime = moment(new Date(values["time"][1])).format("YYYY-MM-DD").concat(" 23:59:59")
			delete values.time
		}
		setParams(values)
	}
	// 点击重置按钮 参数为空
	const toResethandle = () => {
		setParams({})
		form.resetFields()
	}
	const [tradeClassOne, setTradeClassOne] = useState<TradeClassList[]>([])
	const [tradeClassTwo, setTradeClassTwo] = useState([])
	//新增创建人查询功能
	const [creators, setCreators] = useState<Creators[]>([])
	// 初始加载获取一级分类 + 创建人信息列表
	useEffect(() => {
		serviceData.getTradeClass({ pid: 0 }).then(res => {
			setTradeClassOne(res.data)
		})
		serviceData.creators().then(res => {
			setCreators(res.data)
		})
	}, [])
	// 改变一级分类加载二级分类
	const onValuesChange = useCallback((changedValues: any, values: any) => {
		if ("industryId" in changedValues) {
			serviceData.getTradeClass({ pid: changedValues.industryId }).then(res => {
				setTradeClassTwo(res.data)
			})
		}
		// if ("time" in changedValues) {
		// 	console.log(params)
		// }
	}, [])
	useEffect(() => {
		form.setFields([
			{
				name: "solutionId",
				value: ""
			}
		])
	}, [tradeClassTwo])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<Form form={form} onFinish={onFinish} onValuesChange={onValuesChange}>
					<Form.Item name="key" label="关键字" style={{ display: "inline-flex", width: "calc(20% - 4px)" }}>
						<Input placeholder={"请输入行业名称"} maxLength={20} />
					</Form.Item>
					<Form.Item
						name="industryId"
						label="行业分类"
						style={{ display: "inline-flex", width: "calc(20% - 4px)", marginLeft: 20 }}
					>
						<Select placeholder={"一级分类"}>
							{tradeClassOne.map(item => (
								<Option key={item.id} value={item.id}>
									{item.title}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="solutionId" style={{ display: "inline-flex", width: "calc(15% - 4px)", marginLeft: 10 }}>
						{/* tradeClassTwo */}
						<Select placeholder={"二级分类"}>
							{tradeClassTwo.map(item => (
								<Option key={item.id} value={item.id}>
									{item.title}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						name="status"
						label={"状态"}
						style={{ display: "inline-flex", width: "calc(20% - 4px)", marginLeft: 20 }}
					>
						{/* tradeClassTwo */}
						<Select placeholder={"状态"}>
							<Option key={-1} value={-1}>
								{"待上架"}
							</Option>
							<Option key={0} value={0}>
								{"已下架"}
							</Option>
							<Option key={1} value={1}>
								{"已上架"}
							</Option>
						</Select>
					</Form.Item>
					<Form.Item
						name="time"
						label={"创建时间"}
						style={{ display: "inline-flex", width: "calc(20% - 4px)", marginLeft: 20 }}
					>
						<RangePicker />
					</Form.Item>
					<Form.Item name="creator" label={"创建人"} style={{ display: "inline-flex", width: "calc(20% - 4px)" }}>
						<Select
							showSearch
							placeholder="请选择创建人"
							allowClear
							optionFilterProp="children"
							filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
						>
							{creators.map(item => (
								<Option key={item.id} value={item.id}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item style={{ display: "inline-flex", marginLeft: 20 }}>
						<Button className="colorBtn" htmlType="submit" style={{ marginLeft: 20 }}>
							<span style={{ margin: "0 auto" }}>搜索</span>
						</Button>
					</Form.Item>
					<Button onClick={toResethandle} style={{ marginLeft: 20 }}>
						<span style={{ margin: "0 auto" }}>重置</span>
					</Button>
				</Form>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					exportIndex={exportIndex}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"oneType",
						"twoType",
						"schemeName",
						"dataStatus",
						"productCount",
						"creatorName",
						"createDate"
					]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceData.getTradeData}
					// dataSource={dataSource}
					rowSelection={{
						selectedRowKeys: selectKeys,
						onChange: selectChange
					}}
				/>
			</Col>
		</Row>
	)
}
tradeData.title = "行业数据"
export default tradeData
