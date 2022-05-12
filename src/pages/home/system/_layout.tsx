import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const system = (props: PageProps) => {
	return <>{props.children}</>
}
system.title = "系统管理"
// system.icon = "iconfont iconpeizhigongneng"
export default system
