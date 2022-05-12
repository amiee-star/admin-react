/* 时间转换为时间戳 */
const toTime = (value: string) => {
	value = value.replace(/-/g, "/")
	let time = new Date(value).getTime()
	return time
}

export default toTime
