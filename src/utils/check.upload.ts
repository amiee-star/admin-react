import fileType from "@/constant/file.type"
import { message } from "antd"
import { RcFile } from "antd/lib/upload"
import { reject } from "lodash"
interface checkParams {
	type?: keyof typeof fileType
	//以m为单位,不是kb
	maxSize?: number
	typeError?: string
	sizeError?: string
}
export default (params: checkParams) => (file: RcFile): Promise<RcFile> => {
	const { type, typeError, maxSize, sizeError } = params
	return new Promise(async resolve => {
		if (!type && maxSize === undefined) {
			resolve(file)
		}
		if (type || maxSize) {
			let error = ""
			const checkType = fileType[type]
			if (!!type && !checkType.some(type => file.name.toLowerCase().includes(type))) {
				error = typeError || "暂不支持该文件类型"
			}
			if (maxSize !== undefined && file.size > maxSize * Math.pow(1024, 2)) {
				error = sizeError || `文件大小不能超过${maxSize}M`
			}
			error ? message.error(error) && reject(error) : resolve(file)
		}
	})
}
