import { CloseOutlined, DeleteOutlined, PaperClipOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select, List, message, Space, InputNumber, BackTopProps } from "antd"
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

import urlFunc from "@/utils/url.func"

import { FormListFieldData, FormListOperation } from "antd/lib/form/FormList"
import limitNumber from "@/utils/checkNum.func"

const { Option } = Select
interface Props {
	id?: string
	item?: {}
	stat?: boolean
}

interface VideoListProps {
	fields: FormListFieldData[]
	action: FormListOperation
	stat?: boolean
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
							disabled={props.stat}
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
							disabled={props.stat}
						/>
					</Form.Item>
					<MinusCircleOutlined onClick={removeItem(field.name)} />
				</Space>
			))}
			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />} hidden={props.stat}>
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
							disabled={props.stat}
						/>
					</Form.Item>
					<Form.Item
						name={[field.name, "title"]}
						fieldKey={[field.fieldKey, "title"]}
						rules={[{ required: true, message: "请输入文件标题" }]}
					>
						<Input placeholder="请输入文档名称" max={20} disabled={props.stat} />
					</Form.Item>
					<MinusCircleOutlined onClick={removeItem(field.name)} />
				</Space>
			))}
			<Form.Item>
				<Button type="default" onClick={addItem} block icon={<PlusOutlined />} hidden={props.stat}>
					新增文档
				</Button>
			</Form.Item>
		</>
	)
}

const UpdateTradeModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)

	//!!!!
	let [relateProducts, setRelateProducts] = useState([])
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
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
		return data.map(m => {
			return {
				url: m.url[0].fileSaveUrl,
				videoImg: m.videoImg[0].fileSaveUrl,
				title: ""
			}
		})
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

	//图片渲染转换
	const formatFile = (url: any) => {
		if (url instanceof Array) {
			const arr: { filePreviewUrl: string; fileSaveUrl: string; fileSize: number }[] = []
			url.forEach(item => {
				arr.push({
					filePreviewUrl: `${urlFunc.replaceUrl(item.url, "imageUrl")}`,
					fileSaveUrl: item.url,
					fileSize: 10
				})
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: `${urlFunc.replaceUrl(url, "imageUrl")}`,
					fileSaveUrl: url,
					fileSize: 10
				}
			]
		}
	}

	const formatVideoCover = (url: any) => {
		if (url instanceof Array) {
			const arr: { filePreviewUrl: string; fileSaveUrl: string; fileSize: number }[] = []
			url.forEach(item => {
				arr.push({
					filePreviewUrl: `${urlFunc.replaceUrl(item.videoImg, "imageUrl")}`,
					fileSaveUrl: item.url,
					fileSize: 10
				})
			})
			return arr
		} else {
			return [
				{
					filePreviewUrl: `${urlFunc.replaceUrl(url, "imageUrl")}`,
					fileSaveUrl: url,
					fileSize: 10
				}
			]
		}
	}

	const [tradeClassOne, setTradeClassOne] = useState([])
	const [tradeClassTwo, setTradeClassTwo] = useState([])
	// 初始加载获取一级分类
	// useEffect(() => {}, [])
	// 改变一级分类加载二级分类
	const onValuesChange = useCallback((changedValues: any) => {
		if ("industryId" in changedValues) {
			serviceData.getTradeClass({ pid: changedValues.industryId }).then(res => {
				setTradeClassTwo(res.data)
				form.setFieldsValue({ solutionId: "" })
			})
		}
	}, [])
	const onFinish = useCallback(
		data => {
			const dimensionalPicArr = transformUrl(data.dimensionalDrawing, "url")
			const videosArr = transformVideo(data.videos)
			let docArr: { url: { fileSaveUrl: any }[] }[] = []
			if (data.documents) {
				docArr = getDocuments(data.documents)
			}

			const productIds: any[] = []
			relateProducts.forEach(item => {
				// productIds.push(item.productId)
				productIds.push(item.productId || item.id)
			})
			serviceData
				.updateTradeData({
					id: props.id,
					industryId: data.industryId,
					solutionId: data.solutionId,
					title: data.title,
					content: data.content,
					products: productIds,
					image: data.image?.[0].fileSaveUrl,
					introduction: data.introduction,
					dimensionalDrawing: dimensionalPicArr,
					documents: docArr,
					videos: videosArr,
					sort: data.sort
				})
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doTradeInfo", true)
						closeModal()
						message.success("编辑成功")
					} else if (res.code === 1010) {
						message.error(res.msg)
					}
				})
		},
		[relateProducts]
	)
	const [infoData, setInfoData] = useState<any>()
	useEffect(() => {
		serviceData.getTradeDataById({ id: props.id }).then(res => {
			if (res.code === 200) {
				let data = res.data
				const videoArr: {
					videoImg: { filePreviewUrl: string; fileSaveUrl: any; fileSize: number }[]
					url: { filePreviewUrl: string; fileSaveUrl: any; fileSize: number }[]
				}[] = []
				if (!!res.data.videos) {
					data.videos.map(({ url, videoImg }, index) => {
						videoArr.push({ videoImg: formatVideoCover(videoImg), url: formatFile(url) })
					})
				}
				const documentArr: { url: { filePreviewUrl: string; fileSaveUrl: any; fileSize: number }[]; title: any }[] = []
				if (!!res.data.documents) {
					data.documents.map(({ url, title }, index) => {
						documentArr.push({ url: formatFile(url), title: title })
					})
				}

				setRelateProducts(res.data.products)
				form.setFieldsValue({
					...res.data,
					image: !!res.data.image ? formatFile(res.data.image) : null,
					dimensionalDrawing: !!res.data.dimensionalDrawing ? formatFile(res.data.dimensionalDrawing) : null,
					documents: documentArr,
					videos: videoArr
				})
				serviceData.getTradeClass({ pid: res.data.industryId }).then(res => {
					setTradeClassTwo(res.data)
				})
				setDone(true)
				setInfoData(res.data)
			} else {
				message.error(res.msg)
			}
		})
	}, [props.id])
	useEffect(() => {
		serviceData.getTradeClass({ pid: 0 }).then(res => {
			setTradeClassOne(res.data)
		})
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
		done && (
			<Card
				id="tradeInfoBox"
				style={{ width: 700 }}
				title={props.id == "" ? "新增行业信息" : props.stat ? "查看行业信息" : "编辑行业信息"}
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
							<Form.Item label="行业大类：" name="industryId" rules={[{ required: true, message: "请选择行业大类" }]}>
								<Select placeholder={"一级分类"} disabled={props.stat}>
									{/* defaultValue={props.item.industryName} */}
									{tradeClassOne.map(item => (
										<Option key={item.id} value={item.id}>
											{item.title}
										</Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item
								label="应用场景/解决方案："
								name="solutionId"
								rules={[{ required: true, message: "请选择应用场景/解决方案" }]}
							>
								<Select placeholder={"请选择应用场景/解决方案"} disabled={props.stat}>
									{tradeClassTwo.map(item => (
										<Option key={item.id} value={item.id}>
											{item.title}
										</Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item
								label="方案/技术应用命名："
								name="title"
								rules={[{ required: true, message: "请选择方案/技术应用命名,最多100字", max: 100 }]}
							>
								<Input placeholder="请输入方案/技术应用命名" disabled={props.stat} />
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
									disabled={props.stat}
								></FormUploads>
							</Form.Item>
							<Form.Item label="排序：" name="sort" rules={[{ required: true, message: "请输入排序" }]}>
								<InputNumber
									style={{ width: 200 }}
									max={9999}
									min={0}
									step={1}
									formatter={limitNumber}
									parser={limitNumber}
									placeholder="请输入正整数"
									disabled={props.stat}
								/>
							</Form.Item>
							<Form.Item label="方案简介：" name="introduction">
								<TextArea showCount maxLength={500} disabled={props.stat} />
							</Form.Item>
							<Form.Item label="具体内容：" name="content">
								<FormEditor defaultContent={infoData?.content} stat={props.stat} />
							</Form.Item>

							<Form.Item label="尺寸图：" name="dimensionalDrawing" extra="文件大小2M之内，分辨率800*452jpg、png">
								<FormUploads
									accept=".png, .jpg, .jpeg"
									customCheck={checkImage("image", 2.3)}
									checkType={"hotImage"}
									imgAction={{ crop: true, aspectRatio: [800, 452] }}
									size={9999}
									disabled={props.stat}
								/>
							</Form.Item>

							<Form.Item label="文档列表">
								<Form.List name={"documents"}>
									{(fields, action) => <DocumentList fields={fields} action={action} stat={props.stat} />}
								</Form.List>
							</Form.Item>

							<Form.Item label="视频列表">
								<Form.List name={"videos"}>
									{(fields, action) => <VideoList fields={fields} action={action} stat={props.stat} />}
								</Form.List>
							</Form.Item>

							<Form.Item label="关联产品：">
								<Button onClick={relatProductsBtn(relateProducts)} hidden={props.stat}>
									{"+添加"}
								</Button>
								{!!relateProducts && (
									<List
										grid={{ gutter: 16, column: 2 }}
										dataSource={relateProducts}
										rowKey="productId"
										renderItem={item => (
											<List.Item key={item.id}>
												<div style={{ margin: "10px 0" }}>
													<PaperClipOutlined style={{ marginRight: "5px" }} />
													<span>{item.title}</span>
													<DeleteOutlined
														style={{ marginLeft: "10px" }}
														onClick={deleterelateProduct(item.id)}
														hidden={props.stat}
													/>
												</div>
											</List.Item>
										)}
									/>
								)}
							</Form.Item>

							<Form.Item style={{ textAlign: "right" }}>
								<Button type="primary" htmlType="submit" hidden={props.stat}>
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
	)
}

export default UpdateTradeModal
