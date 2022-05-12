import React, { useCallback, useState } from "react"
import reactCSS from "reactcss"
import { SketchPicker } from "react-color"

interface Props {
	setCo: (value: React.SetStateAction<string>) => void
	colorprop: string
}
const ColorPick = (props: Props) => {
	const { setCo, colorprop } = props
	const [color, setColor] = useState(colorprop)
	const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)

	const handleClick = useCallback(() => {
		setDisplayColorPicker(!displayColorPicker)
	}, [])
	const handleClose = useCallback(() => {
		setDisplayColorPicker(false)
	}, [])

	const handleChange = useCallback(color => {
		setCo(color.hex)
		setColor(color.hex)
	}, [])

	const styles = reactCSS({
		default: {
			color: {
				width: "36px",
				height: "14px",
				borderRadius: "2px",
				background: color
			},
			swatch: {
				padding: "5px",
				background: "#fff",
				borderRadius: "1px",
				boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
				display: "inline-block",
				cursor: "pointer"
			},
			popover: {
				position: "absolute",
				zIndex: "2",
				top: "-320px"
			},
			cover: {
				position: "fixed",
				top: "0px",
				right: "0px",
				bottom: "0px",
				left: "0px"
			}
		}
	})

	return (
		<div>
			<div style={styles.swatch} onClick={handleClick}>
				<div style={styles.color} />
			</div>
			{displayColorPicker ? (
				<div style={styles.popover}>
					<div style={styles.cover} onClick={handleClose} />
					<SketchPicker color={color} onChange={handleChange} />
				</div>
			) : null}
		</div>
	)
}

export default ColorPick
