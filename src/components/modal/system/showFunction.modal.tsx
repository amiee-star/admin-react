import serviceSys from "@/services/service.sys"
import eventBus from "@/utils/event.bus"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Radio, Switch, Row, Col, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "../modal.context"

interface Props {
	id: string
}
const showFunctionModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [done, setDone] = useState(false)
	const selectKeys = useRef([])
	const onChange = (item: any) => (checked: boolean, event: Event) => {
		if (!checked) {
			item.isDel = 1
		} else {
			item.isDel = 0
		}
		selectKeys.current.push(item)
	}
	const [showMenubar, setShowMenubar] = useState([])
	const allMenubar = useRef([])
	const webState = useRef(0)
	useEffect(() => {
		serviceSys.getExhibition({ id: props.id }).then(res => {
			if (res.code === 200) {
				setShowMenubar(res.data.listMenubar)
				allMenubar.current = res.data.listMenubar
				webState.current = res.data.webState
				setDone(true)
			}
		})
	}, [props.id])
	const onChangeWebState = (item: any) => {
		webState.current = item.target.value
	}

	const onFinish = useCallback(
		data => {
			const finallyShow = allMenubar.current.concat(selectKeys.current)
			const showIdArr: any[] = []
			finallyShow.map(item => {
				if (item.isDel == 0) {
					showIdArr.push(item.menubarId)
				}
			})
			const showIds = new Set(showIdArr)
			serviceSys
				.editExhibitionList({
					id: props.id,
					listMenubarId: Array.from(showIds),
					webState: webState.current
				})
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doShowInfo")
						closeModal()
						message.success("功能配置成功")
					} else {
						message.error(res.msg)
					}
				})
		},
		[props.id]
	)

	return (
		done && (
			<Card
				style={{ width: 530 }}
				title={"官网首页功能配置"}
				extra={
					<Button type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 11 }}
					// wrapperCol={{ span: 19 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
					initialValues={{
						active: true
					}}
				>
					<div>网站设置</div>
					<Form.Item label={"网站上架设置"} name="webState">
						<Radio.Group onChange={onChangeWebState} defaultValue={webState.current}>
							<Radio value={0}>下架</Radio>
							<Radio value={1}>上架</Radio>
						</Radio.Group>
					</Form.Item>
					<div>栏目设置</div>
					<Row>
						{showMenubar.map((item, index) => {
							return (
								<Col key={item.id} span={12}>
									<Form.Item label={item.title} name="check">
										<Switch defaultChecked={item.isDel == 0 ? true : false} onChange={onChange(item)} />  
									</Form.Item>
								</Col>
							)
						})}
					</Row>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</Form>
			</Card>
		)
	)
}

export default showFunctionModal
