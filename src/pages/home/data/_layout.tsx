import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const basicData = (props: PageProps) => {
	return <>{props.children}</>
}
basicData.title = "基础数据"
// basicData.icon = "iconfont iconpeizhigongneng"
export default basicData
