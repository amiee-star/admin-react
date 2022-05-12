import { PageProps } from "@/interfaces/app.interface"
import React, { useEffect } from "react"
import eventBus from "@/utils/event.bus"
const welcomePage = (props: PageProps) => {
	const exhibitionId = location.search.split("exhibitionId=")[1]
	useEffect(() => {
		eventBus.emit("doExhibitionId", exhibitionId)
	}, [])
	return (
		<div id="welcomePage" style={{ position: "relative" }}>
			<img
				style={{
					width: "1000px",
					height: "600px",
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					margin: "0 auto"
				}}
				src={require("@/assets/images/welcomePage/welcomePage.png")}
			/>
		</div>
	)
}
welcomePage.title = "大华展会内容"
welcomePage.menu = false
export default welcomePage
