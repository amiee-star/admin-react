import { CloseOutlined, DeleteOutlined, PaperClipOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"

import { Button, Card, Input, Form, Select, List, message, Space, InputNumber } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { AsyncModal, ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import FormEditor from "@/components/form/form.editor"
import "./addTradeInfo.modal.less"
import RelatProductModal from "./relatProduct.modal"
import serviceData from "@/services/service.data"
import checkImage from "@/utils/checkImage.func"
import checkVideo from "@/utils/checkVideo.func"
import { upFileItem } from "@/interfaces/api.interface"

import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"
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
	console.log(fields)
	console.log(action)

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

const AddTradeModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	//!!!!
	let [relateProducts, setRelateProducts] = useState([])
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [tradeClassOne, setTradeClassOne] = useState([])
	const [tradeClassTwo, setTradeClassTwo] = useState([])
	// 初始加载获取一级分类
	useEffect(() => {
		serviceData.getTradeClass({ pid: 0 }).then(res => {
			setTradeClassOne(res.data)
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

	// 视频转换
	const transformVideo = useCallback((data: { url: upFileItem[]; videoImg: upFileItem[] }[]) => {
		return data.map(m => {
			return {
				url: m.url[0].fileSaveUrl,
				videoImg: m.videoImg[0].fileSaveUrl,
				title: ""
			}
		})
	}, [])

	// 文档数据转换
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

	// 改变一级分类加载二级分类
	const onValuesChange = useCallback((changedValues: any, values: any) => {
		if ("industryId" in changedValues) {
			serviceData.getTradeClass({ pid: changedValues.industryId }).then(res => {
				setTradeClassTwo(res.data)
			})
		}
	}, [])

	const onFinish = useCallback(
		data => {
			if (!mark) return
			mark = false
			const dimensionalPicArr = transformUrl(data.dimensionalDrawing, "url")
			const videosArr = !!data.videos ? transformVideo(data.videos) : []

			let docArr: { url: { fileSaveUrl: any }[] }[] = []
			if (data.documents) {
				docArr = getDocuments(data.documents)
			}

			const productIds: any[] = []
			relateProducts.forEach(item => {
				productIds.push(item.productId || item.id)
			})
			if (!props.id) {
				serviceData
					.addTradeData({
						industryId: data.industryId,
						solutionId: data.solutionId,
						title: data.title,
						content: data.content,
						products: productIds,
						image: data.image[0]?.fileSaveUrl,
						introduction: data.introduction,
						dimensionalDrawing: dimensionalPicArr,
						documents: docArr,
						videos: videosArr,
						sort: data.sort
					})
					.then(res => {
						if (res.code === 200) {
							eventBus.emit("doTradeInfo")
							form.resetFields()
							closeModal()
							message.success("新增成功")
						} else if (res.code === 1010) {
							message.error(res.msg)
						}
					})
					.finally(() => {
						mark = true
					})
			}
		},
		[relateProducts]
	)

	useEffect(() => {
		eventBus.on("RelateProducts", val => {
			setRelateProducts(val)
		})
		return () => {
			eventBus.off("RelateProducts")
		}
	}, [])
	const relatProductsBtn = (data: any) => async () => {
		const modalData = await AsyncModal({
			content: RelatProductModal,
			mask: true,
			params: {
				data
			}
		})
		setRelateProducts(modalData)
	}
	const deleterelateProduct = (id: number) => () => {
		setRelateProducts(
			relateProducts.filter(item => {
				return item.id !== id
			})
		)
	}
	return (
		<Card
			id="tradeInfoBox"
			style={{ width: 700 }}
			title={props.id == "" ? "新增行业信息" : "编辑行业信息"}
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
						// wrapperCol={{ span: 19 }}
						form={form}
						preserve={false}
						onFinish={onFinish}
						onValuesChange={onValuesChange}
					>
						<Form.Item label="行业：" name="industryId" rules={[{ required: true, message: "请选择行业分类" }]}>
							<Select placeholder={"行业分类"}>
								{tradeClassOne.map(item => (
									<Option key={item.id} value={item.id}>
										{item.title}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="应用场景" name="solutionId" rules={[{ required: true, message: "请选择应用场景" }]}>
							<Select placeholder={"请选择应用场景"}>
								{tradeClassTwo.map(item => (
									<Option key={item.id} value={item.id}>
										{item.title}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item label="解决方案名称" name="title" rules={[{ required: true, message: "请输入解决方案名称" }]}>
							<Input placeholder="请输入解决方案名称" />
						</Form.Item>
						<Form.Item
							label="封面图："
							name="image"
							rules={[{ required: true, message: "请选择封面图" }]}
							extra="文件大小2M之内，分辨率796*448jpg、png"
						>
							<FormUploads
								accept=".png, .jpg, .jpeg"
								customCheck={checkImage("image", 2.3)}
								checkType={"hotImage"}
								imgAction={{ crop: true, aspectRatio: [796, 448] }}
							></FormUploads>
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
						<Form.Item label="方案简介：" name="introduction">
							<TextArea showCount maxLength={150} />
						</Form.Item>
						<Form.Item label="具体内容：" name="content">
							<FormEditor
								onChange={e => {
									console.log(e)
								}}
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

						<Form.Item label="关联产品：">
							<Button onClick={relatProductsBtn(relateProducts)}>{"+添加"}</Button>
							{!!relateProducts && (
								<List
									grid={{ gutter: 16, column: 2 }}
									dataSource={relateProducts}
									renderItem={item => (
										<List.Item>
											<div style={{ margin: "10px 0" }}>
												<PaperClipOutlined style={{ marginRight: "5px" }} />
												<span>{item.title}</span>
												<DeleteOutlined style={{ marginLeft: "10px" }} onClick={deleterelateProduct(item.id)} />
											</div>
										</List.Item>
									)}
								/>
							)}
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

export default AddTradeModal
