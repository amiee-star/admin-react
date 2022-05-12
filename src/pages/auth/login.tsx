import { userContext } from "@/components/provider/user.context"
import serviceUser from "@/services/service.user"
import { LockOutlined, UserOutlined, InsuranceOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message } from "antd"
import React, { useState, useCallback, useContext, useEffect } from "react"
import md5 from "js-md5"
import lsFunc from "@/utils/ls.func"

import "./login.less"
import { PageProps } from "@/interfaces/app.interface"

const AuthLogin = (props: PageProps) => {
	const { history } = props
  const [ codeId, setCodeId] = useState('')
  const [ base64, setBase64] = useState('')
	const { dispatch } = useContext(userContext)

  useEffect(() => {
		serviceUser.generateCode()
      .then(res => {
        console.log(res)
        if (res.code == 200) {
          let { codeId, base64 } = res.data
          setCodeId(codeId)
          setBase64(base64)
        }
      })
	}, [])

	const onFinish = useCallback(data => {
		serviceUser
			.loginIn({ username: data.username, password: md5(data.password), code: data.code, codeId: codeId })
			.then(res => {
				if (res.code == 200) {
					lsFunc.setItem("token", res.data)
					return serviceUser.getUserInfo({})
				}else {
          sendEmail()
					return message.error(res.msg)
				}
			})
			.then(res => {
				if (res && res.code == 200) {
					dispatch({
						type: "set",
						payload: {
							user: res.data
						}
					})
					history.replace("/home/dashboard.html")
				} else {
          sendEmail()
        }
			}).catch((err) => {
        sendEmail()
      })
	}, [codeId])

  const sendEmail = () => {
    serviceUser.generateCode()
    .then(res => {
      if (res.code == 200) {
        let { codeId, base64 } = res.data
        setCodeId(codeId)
        setBase64(base64)
      }
    })
  }

	return (
		<div id="AuthLogin" className="full">
			<Card className="login-content">
				<div className="login-logo">
					<img src={require("../../assets/images/login/loginLog.png")} alt="logo" />
				</div>

				<div className="login-form">
					<div className="login-title">展会内容管理后台</div>
					<Form labelCol={{ span: 4 }} onFinish={onFinish}>
						<Form.Item name="username" rules={[{ required: true, message: "请输入帐号!" }]} className="login-input">
							<Input
								prefix={<UserOutlined />}
								placeholder="请输入帐号"
								style={{ color: "#999999" }}
								className="formItem"
							/>
						</Form.Item>
						<Form.Item name="password" rules={[{ required: true, message: "请输入密码!" }]} className="login-input">
							<Input.Password
								prefix={<LockOutlined />}
								style={{ color: "#999999" }}
								type="password"
								placeholder="请输入密码"
							/>
						</Form.Item>
            <Form.Item name="code" rules={[{ required: true, message: "请输入验证码!" }]} className="login-input">
							<Input
                prefix={<InsuranceOutlined />}
								style={{ color: "#999999" }}
								placeholder="请输入验证码"
                suffix={<a onClick={() => sendEmail()}>
                  <img src={'data:image/png;base64,' + base64} alt="logo" />
                </a>}
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" block className="login-btn">
								登录
							</Button>
						</Form.Item>
					</Form>
				</div>
			</Card>
		</div>
	)
}
AuthLogin.title = "登录"
export default AuthLogin
