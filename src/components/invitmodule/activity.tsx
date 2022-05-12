import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, message, Select, FormInstance } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal/modal.context"
import eventBus from "@/utils/event.bus"
import serviceSys from "@/services/service.sys"
import { Datum, SearchSuggestion } from "@/interfaces/map.interface"
import { debounce, remove } from "lodash"
import serviceMap from "@/services/service.map"
import { Sign } from "@/interfaces/api.interface"
import { Store } from "antd/es/form/interface"
import axios from "axios"
import "./activity.less"
import TextArea from "antd/lib/input/TextArea"
const { Option } = Select
interface Props {
	// mapData: Sign[]
	// setMapData: (values: Store) => void
	// form: FormInstance<any>
	loc: { longitude: string; latitude: string }
}

let mark = true

var map = null
var center = null
var marker = null
var marItem: Datum = null
var circle = null

const Activity: React.FC<Props> = props => {
	const { loc = null } = props
	const [searches, setSearches] = useState<Datum[]>()
	const [keyword, setKeyword] = useState<string>("")
	const [chosenData, SetChosenData] = useState<Datum>(null)
	// const [mapData, setMapData] = useState<Sign[]>(!!mapData ? mapData : [])
	const [centerRadius, setCenterRadius] = useState<number>(500)

	const initMap = useCallback(() => {
		//定义地图中心点坐标
		center = new TMap.LatLng(loc ? loc.longitude : 39.954104, loc ? loc.latitude : 116.357503)
		//定义map变量，调用 TMap.Map() 构造函数创建地图
		map = new TMap.Map(document.getElementById("activitymapContainer"), {
			center: center, //设置地图中心点坐标
			zoom: 12.2 //设置地图缩放级别
		})

		const markerArr =
			// !!mapData
			// ? mapData.map((v, index) => {
			// return {
			// 	id: index,
			// 	styleId: "marker",
			// 	position: new TMap.LatLng(v.latitude, v.longitude),
			// 	properties: { title: v.locationName }
			// }
			//   })
			//   :
			!!loc
				? [
						{
							id: loc.latitude,
							styleId: "marker",
							position: new TMap.LatLng(loc.longitude, loc.latitude)
						}
				  ]
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
					center: new TMap.LatLng(loc ? loc.longitude : 39.954104, loc ? loc.latitude : 116.357503), // 设置圆的中心
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

			if (marItem) {
				removeMarker()
			}

			marItem = arr[0]
			SetChosenData(arr[0])

			eventBus.emit("setlocation", arr[0])

			map.setCenter(new TMap.LatLng(marItem.location.lat, marItem.location.lng))
			let obj = {
				id: marItem.id, //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
				styleId: "myStyle", //指定样式id
				position: new TMap.LatLng(marItem.location.lat, marItem.location.lng) //点标记坐标位置
			}
			marker.add([obj])

			// circle.add([
			// 	{
			// 		id: marItem.id,
			// 		center: new TMap.LatLng(marItem.location.lat, marItem.location.lng), // 设置圆的中心
			// 		radius: centerRadius //设置圆的半径
			// 	}
			// ])

			// console.log("circle:", circle)
			// console.log("center:", center)
		},
		[searches, centerRadius, chosenData]
	)

	const removeMarker = useCallback(() => {
		marker.remove([marItem.id])
	}, [])

	const handleSearch = (value: string) => {
		if (value) {
			serviceMap.getSearchSuggestion({ keyword: value }).then(res => {
				if (!!res.data) {
					setSearches(res.data)
				}
			})
		}
	}

	useEffect(() => {
		initMap()
		marItem = loc
	}, [])

	return (
		<>
			<div className="wraper">
				<div id="activitymapContainer" style={{ marginBottom: "30px" }}></div>
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
			<Form.Item name="activityTitle" labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} label="标题">
				<Input placeholder="请输入标题,最多20个字" maxLength={20}></Input>
			</Form.Item>
			<Form.Item name="activityAddress" labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} label="会议地址">
				<TextArea value={chosenData ? chosenData.address : null} autoSize></TextArea>
			</Form.Item>

			<Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 5 }} label="会议时间" name="activityTime">
				<Input maxLength={50}></Input>
			</Form.Item>
		</>
	)
}

export default Activity
