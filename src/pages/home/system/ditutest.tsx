import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Row, Col } from "antd"
import "./ditutest.less"
import { FormattedTimeParts } from "umi"
const testditu = () => {
	// let center = new TMap.LatLng(39.98412, 116.307484)

	const cnter = useMemo(() => {
		return new TMap.LatLng(39.98412, 116.307484)
	}, [])

	useEffect(() => {
		//定义map变量，调用 TMap.Map() 构造函数创建地图
		let map = new TMap.Map(document.getElementById("container"), {
			// center: center, //设置地图中心点坐标
			center: cnter, //设置地图中心点坐标
			zoom: 17.2, //设置地图缩放级别
			pitch: 43.5, //设置俯仰角
			rotation: 45 //设置地图旋转角度
		})
	}, [])

	return (
		<Row className="data-form full">
			<Col className="form-result" span={24}>
				<div id="container"></div>
			</Col>
		</Row>
	)
}
testditu.title = "腾讯地图test"
export default testditu
