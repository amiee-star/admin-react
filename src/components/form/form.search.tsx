import React, { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { Row, Col, Input, Select, DatePicker, Button, Form, InputNumber, Cascader, message } from "antd"
import { Store } from "antd/lib/form/interface"
import moment from "moment"
import { isArray } from "lodash"
import "./form.search.less"
import serviceUser from "@/services/service.user"
import ProxyConfig from "@/../config/proxy"
import lsFunc from "@/utils/ls.func"

export interface OptionItem {
	value: any
	txt: string
}

export interface CityItem {
	code: string
	name: string
	children?: CityItem[]
}
export interface FieldItem {
	name: string
	type: "select" | "text" | "date" | "number" | "rangeDate" | "array" | "cascader"
	title?: string
	data?: OptionItem[] | (() => Promise<OptionItem[]>)
	value?: any
	width?: number
	items?: FieldItem[]
	noStyle?: boolean
	showTime?: boolean
	// add
	option?: CityItem[]
}

interface Props {
	fields: FieldItem[]
	toSearch: (values: Store) => void
	defaultParams?: any
	isShowExcel?: boolean
	provideUrl?: string
}

const FormSearch: React.FC<Props> = props => {
	const { fields, toSearch, defaultParams = {} } = props
	const [fieldsData, setFieldsData] = useState<FieldItem[]>([])
	const [searchFrom] = Form.useForm()
	const token = lsFunc.getItem("token")
	const [exhibitionId, setExhibitionId] = useState<string>(location.search.split("exhibitionId=")[1] || null)
	const vChanges = useCallback(
		v => {
			if (v && v.exhibitionId) {
				setExhibitionId(v.exhibitionId)
			} else {
				setExhibitionId(null)
			}
		},
		[exhibitionId]
	)
	const exportEXCEL = useCallback(() => {
		if (props.provideUrl) {
			if (exhibitionId) {
				window.open(`${ProxyConfig.api.pro}${props.provideUrl}?token=${token}&exhibitionId=${exhibitionId}`)
			} else {
				message.error("请选择展会名称")
			}
		} else {
			window.open(`${ProxyConfig.api.pro}/admin/account/exportUser?token=${token}`)
		}
	}, [exhibitionId])
	const onFinish = useCallback(
		params => {
			const searchParams = { ...defaultParams }
			Object.keys(params)
				.filter(key => !!params[key] || params[key] === 0)
				// .forEach(key => (searchParams[key] = moment.isMoment(params[key]) ? params[key].unix() * 1000 : params[key]))
				.forEach(key => {
					if (key == "city") {
						searchParams.province = params[key][0]
						searchParams.city = params[key][1]
						searchParams.area = params[key][2]
						// searchParams.endTime = moment(new Date(params[key][1])).format("YYYY-MM-DD")
					} else if (moment.isMoment(params[key]) || moment.isMoment(params[key][0])) {
						// searchParams[key] = params[key].unix() * 1000
						searchParams.startTime = moment(new Date(params[key][0])).format("YYYY-MM-DD HH:mm:ss")
						searchParams.endTime = moment(new Date(params[key][1])).format("YYYY-MM-DD HH:mm:ss")
						if (searchParams.startTime.slice(-8) === searchParams.endTime.slice(-8)) {
							searchParams.startTime = searchParams.startTime.slice(0, -8).concat("00:00:00")
							searchParams.endTime = searchParams.endTime.slice(0, -8).concat("23:59:59")
						}
					} else {
						searchParams[key] = params[key]
					}
				})
			toSearch && toSearch(searchParams)
		},
		[toSearch]
	)
	const getParamsStr = useCallback((params: any) => {
		const result = {}
		for (const key in params) {
			if (isArray(params[key]) && !moment.isMoment(params[key])) {
				result[key] = ["array"].concat(params[key].map((m: any) => getParamsStr(m))).join(",")
			} else if (moment.isMoment(params[key])) {
				result[key] = moment(params[key]).toISOString()
			} else {
				result[key] = params[key]
			}
		}
		return result
	}, [])
	const selectData = useRef()
	const onChange = (value: any, dateString: any) => {
		selectData.current = dateString
		return dateString
	}
	const renderFileItem = useCallback((field: FieldItem) => {
		switch (field.type) {
			case "rangeDate":
				const { RangePicker } = DatePicker
				return (
					<Form.Item name={field.name} label={field.title} noStyle={field.noStyle}>
						<RangePicker
							showTime={
								field.showTime && {
									hideDisabledOptions: true,
									defaultValue: [moment("00:00:00", "HH:mm:ss")]
								}
							}
							onChange={onChange}
							// value={selectData.current}
						/>
					</Form.Item>
				)
			case "date":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle}>
						<DatePicker placeholder={field.title} showTime={field.showTime} />
					</Form.Item>
				)
			case "select":
				return (
					<Form.Item name={field.name} label={field.title} noStyle={field.noStyle}>
						<Select dropdownMatchSelectWidth={false} placeholder={field.value}>
							{(field.data! as OptionItem[]).map(item => (
								<Select.Option key={`${field.name}-${item.value}`} value={item.value}>
									{item.txt}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				)
			case "text":
				return (
					<Form.Item name={field.name} label={field.value} noStyle={field.noStyle}>
						{/* style={{ width: field.width, marginRight: 48 }} */}
						<Input placeholder={field.title} style={{ width: field.noStyle ? "50%" : "auto" }} />
					</Form.Item>
				)
			case "number":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle}>
						<InputNumber placeholder={field.title} />
					</Form.Item>
				)
			case "array":
				return (
					<Input.Group compact>
						{field.items?.map(item => (
							<React.Fragment key={item.name}>{renderFileItem({ ...item, noStyle: true })}</React.Fragment>
						))}
					</Input.Group>
				)
			case "cascader":
				return (
					// onChange={onChange}
					// showSearch={filter}
					<Form.Item name={field.name} label={field.value} noStyle={field.noStyle}>
						<Cascader
							options={field.option}
							placeholder={field.title}
							fieldNames={{ label: "name", value: "code", children: "children" }}
							changeOnSelect
						/>
					</Form.Item>
				)
		}
	}, [])

	const getData = useCallback((): Promise<FieldItem[]> => {
		return new Promise(async resolve => {
			const transformFields = [...fields]
			for (const key in transformFields) {
				if (transformFields[key].data && typeof transformFields[key].data === "function") {
					const progress = transformFields[key].data as () => Promise<OptionItem[]>
					transformFields[key].data = await progress()
				}
			}
			resolve(transformFields)
		})
	}, [fields])

	const resetSearchFrom = useCallback(() => {
		searchFrom.resetFields()
		const searchParams = { ...defaultParams }
		toSearch && toSearch(searchParams)
	}, [])

	useEffect(() => {
		getData().then(res => {
			setFieldsData(res)
		})
	}, [fields])
	return (
		<Suspense fallback={<>loading...</>}>
			<Form id="FormSearch" form={searchFrom} onFinish={onFinish} onValuesChange={vChanges}>
				<Row gutter={[10, 10]}>
					{fieldsData.map(field => (
						<Col key={field.name} span={field.width}>
							{renderFileItem(field)}
						</Col>
					))}
					<Col>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								查询
							</Button>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item>
							<Button type="default" htmlType="reset" onClick={resetSearchFrom}>
								重置
							</Button>
						</Form.Item>
					</Col>
					<Col style={props.isShowExcel ? { float: "right" } : { display: "none" }}>
						<Form.Item>
							<Button
								type="default"
								// htmlType="reset"
								onClick={exportEXCEL}
								// ${urlFunc.requestHost()}

								// href={
								// 	props.provideUrl
								// 		? `${ProxyConfig.api.test}${props.provideUrl}?token=${token}&exhibitionId=${exhibitionId}`
								// 		: `${ProxyConfig.api.pro}/admin/account/exportUser?token=${token}`
								// }
							>
								导出excel
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Suspense>
	)
}
export default FormSearch
