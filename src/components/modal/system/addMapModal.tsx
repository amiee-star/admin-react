import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import serviceSys from "@/services/service.sys"
import "./addMapModal.less"
import { Datum, SearchSuggestion } from "@/interfaces/map.interface"
import { debounce, remove } from "lodash"
import serviceMap from "@/services/service.map"
import { Sign } from "@/interfaces/api.interface"
import { Store } from "antd/es/form/interface"
import axios from "axios"
const { Option } = Select
interface Props {
	mapData: Sign[]
	setMapData: (values: Store) => void
}

let mark = true

var map = null
var center = null
var marker = null
var marItem: Datum = null
var circle = null

const AddMapModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, mapData, setMapData } = props
	const [searches, setSearches] = useState<Datum[]>()
	const [keyword, setKeyword] = useState<string>("")
	// const [mapData, setMapData] = useState<Sign[]>(!!mapData ? mapData : [])
	const [form] = Form.useForm()
	const [centerRadius, setCenterRadius] = useState<number>(
		!!form.getFieldValue("scope") ? form.getFieldValue("scope") : 500
	)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const scopes = [
		{ id: 1, txt: 100 },
		{ id: 2, txt: 200 },
		{ id: 3, txt: 300 },
		{ id: 4, txt: 400 },
		{ id: 5, txt: 500 },
		{ id: 6, txt: 600 },
		{ id: 7, txt: 700 },
		{ id: 8, txt: 800 },
		{ id: 9, txt: 900 },
		{ id: 10, txt: 1000 }
	]
	const scopeChange = useCallback(v => {
		// console.log("v的值:", v)

		setCenterRadius(v)
	}, [])
	const onFinish = useCallback(
		data => {
			// if (!mark) return
			// mark = false
			// console.log("提交数据是什么:", data)
			if (!marItem) {
				return message.error("请设置签到位置信息")
			}
			let arr: Sign[] = []
			data.address = marItem.address
			data.longitude = marItem.location.lng
			data.latitude = marItem.location.lat
			data.scope = centerRadius
			arr.push(data)
			arr.push(...mapData)
			setMapData(arr)
			closeModal()
			// mark = true
		},
		[centerRadius, mapData]
	)
	// map

	const initMap = useCallback(() => {
		//定义地图中心点坐标
		center = new TMap.LatLng(
			!!mapData[0] ? mapData[0].latitude : 39.954104,
			!!mapData[0] ? mapData[0].longitude : 116.357503
		)
		//定义map变量，调用 TMap.Map() 构造函数创建地图
		map = new TMap.Map(document.getElementById("mapContainer"), {
			center: center, //设置地图中心点坐标
			zoom: 12.2 //设置地图缩放级别
		})

		const markerArr = !!mapData
			? mapData.map((v, index) => {
					return {
						id: index,
						styleId: "marker",
						position: new TMap.LatLng(v.latitude, v.longitude),
						properties: { title: v.locationName }
					}
			  })
			: null
		marker = new TMap.MultiMarker({
			id: "marker-layer",
			map: map,
			styles: {
				marker: new TMap.MarkerStyle({
					width: 25,
					height: 35,
					anchor: { x: 16, y: 32 },
					src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png"
				})
			},
			geometries: markerArr
		})

		circle = new TMap.MultiCircle({
			id: "first",
			map,
			geometries: [
				{
					center: new TMap.LatLng(
						!!mapData[0] ? mapData[0].latitude : 39.954104,
						!!mapData[0] ? mapData[0].longitude : 116.357503
					), // 设置圆的中心
					radius: 1 //设置圆的半径
				}
			]
		})
	}, [])

	const onChange = useCallback(
		v => {
			let arr = searches.filter(item => item.id == v)
			// console.log("被选中的记录是:", arr[0])
			setKeyword(v)
			form.setFieldsValue({ locationName: arr[0].title })
			if (marItem) {
				removeMarker()
			}

			marItem = arr[0]

			map.setCenter(new TMap.LatLng(marItem.location.lat, marItem.location.lng))
			let obj = {
				id: marItem.id, //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
				styleId: "myStyle", //指定样式id
				position: new TMap.LatLng(marItem.location.lat, marItem.location.lng) //点标记坐标位置
			}
			marker.add([obj])

			circle.add([
				{
					id: marItem.id,
					center: new TMap.LatLng(marItem.location.lat, marItem.location.lng), // 设置圆的中心
					radius: centerRadius //设置圆的半径
				}
			])

			// console.log("circle:", circle)
			// console.log("center:", center)
		},
		[searches, centerRadius]
	)

	useEffect(() => {
		if (!circle) return
		if (!marItem) return
		circle.remove([marItem.id])

		let time = setTimeout(() => {
			circle.add([
				{
					id: marItem.id,
					center: new TMap.LatLng(marItem.location.lat, marItem.location.lng), // 设置圆的中心
					radius: centerRadius //设置圆的半径
				}
			])
			clearTimeout(time)
		}, 20)
	}, [centerRadius])

	const removeMarker = useCallback(() => {
		marker.remove([marItem.id])
		circle.remove([marItem.id])
	}, [])

	const handleSearch = (value: string) => {
		if (value) {
			// axios
			// 	.get(`https://apis.map.qq.com/ws/place/v1/suggestion?key=XL3BZ-RJM6S-YVXOC-6XT3K-ZBY66-WVF4Z&keyword=${value}`)
			// 	.then(res => {
			// 		console.log(res)
			// 	})
			serviceMap.getSearchSuggestion({ keyword: value }).then(res => {
				if (!!res.data) {
					setSearches(res.data)
				}
			})
		}
	}

	useEffect(() => {
		// 请求接口
		initMap()
	}, [])

	return (
		<Card
			style={{ width: 1000 }}
			title={"添加签到地点"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 4 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				initialValues={{ scope: 500 }}
			>
				<div className="wraper">
					<div id="mapContainer" style={{ marginBottom: "30px" }}></div>
					<div className="searchBar">
						<Select
							style={{ width: "100%" }}
							showSearch
							value={keyword}
							placeholder="请输入打卡地点"
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							onSearch={handleSearch}
							onChange={onChange}
							notFoundContent={null}
						>
							{searches &&
								searches.map(d => (
									<Option key={d.id} value={d.id}>
										{d.title}
									</Option>
								))}
						</Select>
					</div>
				</div>
				<Form.Item
					wrapperCol={{ span: 8 }}
					label="打卡地点名称"
					name="locationName"
					rules={[{ required: true, message: "请输入打卡地点名称" }]}
				>
					<Input placeholder="请输入打卡地点名称" maxLength={50} />
				</Form.Item>
				<Form.Item wrapperCol={{ span: 3 }} label="打卡范围" name="scope">
					<Select placeholder={"打卡范围"} allowClear onChange={scopeChange}>
						{scopes.map(item => (
							<Option key={item.id} value={item.txt}>
								{`${item.txt}米`}
							</Option>
						))}
					</Select>
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
		</Card>
	)
}

export default AddMapModal
