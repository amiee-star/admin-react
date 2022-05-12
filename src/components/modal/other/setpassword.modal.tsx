import { CloseOutlined } from "@ant-design/icons"
import { Form, Input, Button, Card, message } from "antd"

import React, { useCallback } from "react"
import { ModalRef } from "../modal.context"
import serviceManage from "@/services/service.manage"
import md5 from "js-md5"

import proxy from "../../../../config/proxy"

interface Props {
	url: string
	appletUrl: string
}
const SetPasswordModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, url, appletUrl } = props
  const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

  const onFinish = (values: any) => {
    serviceManage.resetpassword({ password: md5(values.password), newPassword: md5(values.newPassword) }).then(res => {
      if (res.code === 200) {
        modalRef.current.destroy()
        form.resetFields()
        message.success("修改成功")
      } else {
        message.error(res.msg)
      }
    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

	return (
		<Card
			style={{ width: 550 }}
			title={"重置密码"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
            <Form
              name="basic"
              form={form}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="原密码"
                name="password"
                rules={[{ required: true, message: '请输入原密码' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="新密码"
                name="newPassword"
                rules={[
                  { required: true, message: '请输入新密码' },
                  { min: 8, message:'密码不少于8位'},
                  { pattern:new RegExp('^(?![a-zA-Z]+$)(?![A-Z\\d]+$)(?![A-Z_\\W]+$)(?![a-z\\d]+$)(?![a-z_\\W]+$)(?![\\d_\\W]+$)[a-zA-Z\\d_\\W]{8,}$','g'), message:'至少包含英文大写/英文小写/数字/特殊符号3种组合'}
                ]}
              >
                <Input.Password />
              </Form.Item>
              {/* <Form.Item
                label="确认密码"
                name="checkPassword"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item> */}

              <Form.Item
                name="checkPassword"
                label="确认密码"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: '请输入确认密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码不一致！'));
                    },
                  }),
                ]}
              >
        <Input.Password />
      </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 30 }}>确 定</Button>
                <Button onClick={closeModal}>取 消</Button>
              </Form.Item>
            </Form>
				
		</Card>
	)
}

export default SetPasswordModal
