import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const classSet = (props: PageProps) => {
	return <>{props.children}</>
}
classSet.title = "分类设置"
export default classSet
