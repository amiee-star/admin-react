import { CloseOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select, Space, message, InputNumber } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceData from "@/services/service.data"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import checkImage from "@/utils/checkImage.func"
import FormEditor from "@/components/form/form.editor"
import "./addProductInfo.modal.less"
import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"
import { TradeClassList, upFileItem } from "@/interfaces/api.interface"
import limitNumber from "@/utils/checkNum.func"
const { Option } = Select
interface Props {
	id: string
}
let mark = true
interface VideoListProps {
	fields: FormListFieldData[]
	action: FormListOperation
}
const VideoList: React.FC<VideoListProps> = props => {
	const { fields, action } = props
	const removeItem = useCallback(
		(index: number) => () => {
			action.remove(index)
		},
		[fields, action]
	)
	const addItem = useCallback(() => {
		action.add()
	}, [action])

	return (
		<>
			{fields.map(field => (
				<Space key={field.key} align="baseline">
					<Form.Item
						name={[field.name, "url"]}
						fieldKey={[field.fieldKey, "url"]}
						extra="支持300MB以内的mp4文件，建议H.264编码，分辨率720P，帧数不高于25 fps，码率不超过5Mbps"
						rules={[{ required: true, message: "请上传视频" }]}
					>
						<FormUploads
							baseUrl="imageUrl"
							btnTxt="上传视频"
							accept="video/*"
							checkType={"video"}
							customCheck={checkVideo("video", 300)}
						/>
					</Form.Item>
					<Form.Item
						name={[field.name, "videoImg"]}
						fieldKey={[field.fieldKey, "videoImg"]}
						extra="封面照片分辨率796*448jpg、png"
						rules={[{ required: true, message: "请上传视频封面" }]}
					>
						<FormUploads
							baseUrl="imageUrl"
							btnTxt="视频封面"
							accept="video/*"
							checkType={"video"}
							imgAction={{ crop: true, videoCover: true, aspectRatio: [796, 448] }}
						/>
					</Form.Item>
					<MinusCircleOutlined onClick={removeItem(field.name)} />
				</Space>
			))}
			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />}>
					新增视频
				</Button>
			</Form.Item>
		</>
	)
}

const DocumentList: React.FC<VideoListProps> = props => {
	const { fields, action } = props
	const removeItem = useCallback(
		(index: number) => () => {
			action.remove(index)
		},
		[fields, action]
	)
	const addItem = useCallback(() => {
		action.add()
	}, [action])

	return (
		<>
			{fields.map(field => (
				<Space key={field.key} align="baseline">
					<Form.Item
						name={[field.name, "url"]}
						fieldKey={[field.fieldKey, "url"]}
						rules={[{ required: true, message: "请上传文件" }]}
					>
						<FormUploads
							baseUrl="imageUrl"
							btnTxt="上传文件"
							checkType={"file"}
							accept=".xlsx,.xls,.csv,.pdf,.docx,.doc"
						/>
					</Form.Item>
					<Form.Item
						name={[field.name, "title"]}
						fieldKey={[field.fieldKey, "title"]}
						rules={[{ required: true, message: "请输入文件标题" }]}
					>
						<Input placeholder="请输入文档名称" max={20} />
					</Form.Item>
					<MinusCircleOutlined onClick={removeItem(field.name)} />
				</Space>
			))}
			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />}>
					新增文档
				</Button>
			</Form.Item>
		</>
	)
}

const AddProModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	// 产品分类
	const [productType, setProductType] = useState([])
	const [showType, setShowType] = useState<number>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	// 初始加载获取一级分类
	useEffect(() => {
		serviceData.getProductClass({ pid: 0 }).then(res => {
			setProductType(res.data)
		})
	}, [])
	// 图片参数转换
	const transformUrl = useCallback((data: (object & upFileItem)[], needName: string) => {
		return data
			? data.map(m => ({
					[needName]: m[needName] || m.fileSaveUrl,
					// filePreviewUrl: m.filePreviewUrl || m[needName] ? urlFunc.replaceUrl(m[needName], "api") : "",
					fileSize: m.fileSize || 0
			  }))
			: []
	}, [])
	const transformVideo = useCallback((data: { url: upFileItem[]; videoImg: upFileItem[] }[]) => {
		return data
			? data.map(m => {
					return {
						url: m.url[0].fileSaveUrl,
						videoImg: m.videoImg[0].fileSaveUrl,
						title: ""
					}
			  })
			: []
	}, [])
	const getDocuments = (arr: { url: { fileSaveUrl: any }[] }[]) => {
		const result: any[] = []
		arr.forEach((file: { url: { fileSaveUrl: any }[]; title: string }) => {
			const item = { ...file, url: [...file.url] }
			if (!!item.url && !!item.title) {
				item.url = item.url[0].fileSaveUrl
				result.push(item)
			} else {
				message.info("请选择文档")
			}
		})
		return result
	}
	const onFinish = useCallback(data => {
		if (!mark) return
		mark = false
		const detailPicArr = transformUrl(data.detailMaps, "url")
		const dimensionalPicArr = transformUrl(data.dimensionalDrawing, "url")
		const videosArr = transformVideo(data.videos)
		let docArr: { url: { fileSaveUrl: any }[] }[] = []
		if (data.documents) {
			docArr = getDocuments(data.documents)
		}

		serviceData
			.addProductData({
				// firstCategoryId: data.firstCategoryId,
				// title: data.title,
				// model: data.model,
				...data,
				image: data.image?.[0].fileSaveUrl,
				// content: data.content,
				// parameter: data.parameter,
				detailMaps: detailPicArr,
				dimensionalDrawing: dimensionalPicArr,
				documents: docArr,
				videos: videosArr
				// sort: data.sort
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doProductData")
					form.resetFields()
					closeModal()
					message.success("新增成功")
				} else {
					message.error(res.msg)
				}
			})
			.finally(() => {
				mark = true
			})
	}, [])
	// 新增产品分类字段
	const [tradeClassOne, setTradeClassOne] = useState<TradeClassList[]>([])
	const [tradeClassTwo, setTradeClassTwo] = useState([])
	// 初始加载获取一级分类
	useEffect(() => {
		serviceData.getTradeClass({ pid: 0 }).then(res => {
			setTradeClassOne(res.data)
		})
	}, [])
	// 改变一级分类加载二级分类
	const onValuesChange = useCallback((changedValues: any, values: any) => {
		if ("industryId" in changedValues) {
			form.setFieldsValue({ solutionId: null })
			serviceData.getTradeClass({ pid: changedValues.industryId }).then(res => {
				setTradeClassTwo(res.data)
			})
		}
	}, [])
	return (
		<Card
			id="productInfoBox"
			style={{ width: 700 }}
			title={props.id == "" ? "新增产品信息" : "编辑产品信息"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="productInfo">
				<div className="productInfoForm">
					<Form
						layout="horizontal"
						labelCol={{ span: 6 }}
						form={form}
						onFinish={onFinish}
						onValuesChange={onValuesChange}
					>
						<Form.Item
							label="产品名称："
							name="title"
							rules={[
								{ required: true, message: "请输入产品名称" },
								{ message: "请输入1-100个文字", max: 100 }
							]}
						>
							<Input placeholder="请输入产品名称（最多100个字符）" />
						</Form.Item>
						<Form.Item
							label="产品分类："
							name="firstCategoryId"
							rules={[{ required: true, message: "请输入产品名称" }]}
						>
							<Select placeholder={"请选择产品分类"}>
								{productType.map(item => (
									<Option key={item.id} value={item.id}>
										{item.title}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item name="industryId" label="行业分类">
							<Select placeholder={"一级分类"}>
								{tradeClassOne.map(item => (
									<Option key={item.id} value={item.id}>
										{item.title}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item name="solutionId" label="应用场景/解决方案">
							{/* tradeClassTwo */}
							<Select placeholder={"二级分类"}>
								{tradeClassTwo.map(item => (
									<Option key={item.id} value={item.id}>
										{`${item.title}`}
										<span style={{ float: "right" }}> {`显示类型: ${item.showType == 1 ? "行业" : "产品"}`}</span>
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="排序：" name="sort" rules={[{ required: true }]}>
							<InputNumber
								style={{ width: 200 }}
								max={9999}
								min={0}
								step={1}
								formatter={limitNumber}
								parser={limitNumber}
								placeholder="请输入正整数"
							/>
						</Form.Item>
						<Form.Item label="型号：" name="model">
							<Input placeholder="请输入型号（最多200个字符）" maxLength={200} />
						</Form.Item>
						<Form.Item label="产品封面图：" name="image" extra="文件大小2M之内，分辨率800*452jpg、png">
							<FormUploads
								accept=".png, .jpg, .jpeg"
								customCheck={checkImage("image", 2.3)}
								checkType={"hotImage"}
								imgAction={{ crop: true, aspectRatio: [800, 452] }}
							/>
						</Form.Item>
						<Form.Item label="产品详情图：" name="detailMaps" extra="文件大小2M之内，分辨率800*452jpg、png">
							<FormUploads
								accept=".png, .jpg, .jpeg"
								customCheck={checkImage("image", 2.3)}
								checkType={"hotImage"}
								imgAction={{ crop: true, aspectRatio: [800, 452] }}
								size={9999}
							/>
						</Form.Item>
						<Form.Item label="产品概述：" name="content">
							<FormEditor
							// onChange={e => {
							// 	console.log(e)
							// }}
							/>
						</Form.Item>
						<Form.Item label="技术参数：" name="parameter">
							<FormEditor
							// onChange={e => {
							// 	console.log(e)
							// }}
							/>
						</Form.Item>
						<Form.Item label="尺寸图：" name="dimensionalDrawing" extra="文件大小2M之内，分辨率800*452jpg、png">
							<FormUploads
								accept=".png, .jpg, .jpeg"
								customCheck={checkImage("image", 2.3)}
								checkType={"hotImage"}
								imgAction={{ crop: true, aspectRatio: [800, 452] }}
								size={9999}
							/>
						</Form.Item>
						<Form.Item label="文档列表">
							<Form.List name={"documents"}>
								{(fields, action) => <DocumentList fields={fields} action={action} />}
							</Form.List>
						</Form.Item>
						<Form.Item label="视频列表">
							<Form.List name={"videos"}>{(fields, action) => <VideoList fields={fields} action={action} />}</Form.List>
						</Form.Item>
						<Form.Item style={{ textAlign: "right" }}>
							<Button type="primary" htmlType="submit">
								保存
							</Button>
							<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
								取消
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</Card>
	)
}

export default AddProModal
