import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, List, Avatar } from "antd"
import React, { useCallback, useEffect } from "react"
import { ModalRef } from "../modal.context"
import serviceUser from "@/services/service.user"
import { useState } from "react"
import name from "@/assets/images/backstage/name.png"
import phone from "@/assets/images/backstage/phone.png"
import email from "@/assets/images/backstage/email.png"
import sourse from "@/assets/images/backstage/sourse.png"
import time from "@/assets/images/backstage/time.png"
import unit from "@/assets/images/backstage/unit.png"
// import wxInfo from "@/assets/images/backstage/wx.png"
import pic from "@/assets/images/backstage/pic.png"
import nickname from "@/assets/images/backstage/nickname.png"
import "./userInfo.modal.less"

interface Props {
	id: string
}
const userInfoModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()

	const [data, setData] = useState<any>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceUser.getRegisteredInfo({ id: props.id }).then(res => {
			if (res.code === 200) {
				setData(res.data)
			}
		})
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title={"用户详情"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
			id="registeredUserInfo-Box"
		>
			{!!data && (
				<Form layout="horizontal" labelCol={{ span: 4 }} form={form} preserve={false}>
					<List itemLayout="horizontal" className="list">
						<div>基本信息</div>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={name} />}
								title={
									<div>
										<span className="itemLable">{"姓名："}</span>
										<span className="itemInfo">{data.name}</span>
									</div>
								}
							/>
						</List.Item>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={phone} />}
								title={
									<div>
										<span className="itemLable">{"手机号："}</span>
										<span className="itemInfo">{data.mobile}</span>
									</div>
								}
							/>
						</List.Item>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={email} />}
								title={
									<div>
										<span className="itemLable">{"邮箱："}</span>
										<span className="itemInfo">{data.email}</span>
									</div>
								}
							/>
						</List.Item>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={sourse} />}
								title={
									<div>
										<span className="itemLable">{"注册渠道："}</span>
										<span className="itemInfo">{data.source == 1 ? "pc" : data.source == 2 ? "小程序" : "h5"}</span>
									</div>
								}
							/>
						</List.Item>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={time} />}
								title={
									<div>
										<span className="itemLable">{"注册时间："}</span>
										<span className="itemInfo">{data.createDate}</span>
									</div>
								}
							/>
						</List.Item>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={unit} />}
								title={
									<div>
										<span className="itemLable">{"单位名称："}</span>
										<span className="itemInfo">{data.company}</span>
									</div>
								}
							/>
						</List.Item>
						{data.headimgurl && data.nickname ? (
							<>
								<div className="tipWord">微信信息</div>
								{/* <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={wxInfo} />}
                    title={
                      <div>
                        <span className="itemLable">{"微信信息："}</span>
                        <span className="itemInfo">{"小可爱"}</span>
                      </div>
                    }
                  />
                </List.Item> */}
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar src={pic} />}
										title={
											<div>
												<span className="itemLable">{"微信头像："}</span>
												<Avatar className="itemInfo" src={data.headimgurl}></Avatar>
											</div>
										}
									/>
								</List.Item>
								<List.Item>
									<List.Item.Meta
										avatar={<Avatar src={nickname} />}
										title={
											<div>
												<span className="itemLable">{"微信昵称："}</span>
												<span className="itemInfo">{data.nickname}</span>
											</div>
										}
									/>
								</List.Item>
							</>
						) : null}
					</List>
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit" onClick={closeModal}>
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</Form>
			)}
		</Card>
	)
}

export default userInfoModal
