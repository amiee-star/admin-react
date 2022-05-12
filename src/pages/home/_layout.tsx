import { userContext } from "@/components/provider/user.context"
import { PageProps, RouteItem, SubMenuItem, MenuItem } from "@/interfaces/app.interface"
import { Card, Col, Layout, Menu, Row, Tooltip, Dropdown } from "antd"
import { Route } from "antd/lib/breadcrumb/Breadcrumb"
import SubMenu from "antd/lib/menu/SubMenu"
import { ModalCustom } from "@/components/modal/modal.context"
import { ModalRef } from "@/components/modal/modal.context"
import SetPasswordModal from "@/components/modal/other/setpassword.modal"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { HomeOutlined } from "@ant-design/icons"
import "./_layout.less"
import { PoweroffOutlined, SettingOutlined } from "@ant-design/icons"
const { Sider, Header, Content } = Layout
const LayoutHome = (props: PageProps & ModalRef) => {
	const { location, history, route } = props
	// const [done, setDone] = useState(true)
	const { state, dispatch } = useContext(userContext)
	useEffect(() => {
		!state.user && history.replace(`/auth/login.html?redirect=${location.pathname + location.search}`)
	}, [state])
	// 联调菜单
	const goToDashboard = () => () => {
		props.history.push({
			pathname: `/home/dashboard.html`
		})
	}
	const renderMenu = useCallback(
		(menus: SubMenuItem<MenuItem>[]) => {
			return (
				menus &&
				menus[0] &&
				menus.map(item => {
					if (item.childMenuList && item.childMenuList?.length) {
						return (
							<SubMenu key={item.link} title={item.name}>
								{renderMenu(item.childMenuList)}
							</SubMenu>
						)
					} else {
						return <Menu.Item key={item.link}>{item.name}</Menu.Item>
					}
				})
			)
		},
		[state]
	)

	const getDefault = useMemo(() => {
		function getPath(routes: RouteItem[], initVal: Route[]) {
			const item = routes.find(item => new RegExp(item.path).test(location.pathname))
			if (item && ("menu" in item ? item.menu : true)) {
				initVal.unshift({ path: item.path, breadcrumbName: item.title })
				if (item.routes && item.routes.length) {
					initVal = getPath(item.routes, initVal)
				}
			}
			return initVal
		}
		return getPath(route.routes, [])
	}, [location])

	const menuClick = useCallback(({ ...params }) => {
		history.push(params.key)
	}, [])
	const [open, setOpen] = useState(getDefault.map(m => m.path))
	const onOpenChange = useCallback((e: React.ReactText[]) => setOpen(e.splice(-1).map(m => m.toString())), [])

	const logoutAction = useCallback(() => {
		dispatch({
			type: "clear"
		})
	}, [])

  const resetPassword = useCallback(() => {
			ModalCustom({
				content: SetPasswordModal,
			})
		},
		[]
	)

  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={logoutAction}>
          退出登录
        </span>
      </Menu.Item>
      <Menu.Item>
        <span onClick={resetPassword}>
          重置密码
        </span>
      </Menu.Item>
    </Menu>
  );

	return (
		// done && (
		<Layout id="IndexLayout" className="full">
			<Sider width={256}>
				<div className="layout-left-box">
					<div className="logo">
						<img src={require("../../assets/images/backstage/logo.png")} alt="logo" />
					</div>
					<Menu
						className="layout-menu"
						onOpenChange={onOpenChange}
						openKeys={open}
						defaultOpenKeys={getDefault.map(m => m.path)}
						selectedKeys={[location.pathname]}
						theme="dark"
						mode="inline"
						onClick={menuClick}
					>
						{state.user?.menuList && renderMenu(state.user.menuList)}
					</Menu>
				</div>
			</Sider>
			<Layout>
				<Header>
					<Row justify="space-between" align="middle" gutter={10}>
						<Col span={24}>
							<Row justify="space-between" align="middle">
								<Col>
									<HomeOutlined style={{ fontSize: "20px", marginRight: "15px" }} onClick={goToDashboard()} />
									您本次登录的时间 : {state?.user?.loginDate}
								</Col>
								<Col className="head-img">
									你好，{state?.user?.username}，欢迎来到管理后台！
									{/* <Tooltip placement="bottom" title="退出">
										<span className="goOutBtn" onClick={logoutAction}>
											<SettingOutlined />
										</span>
									</Tooltip> */}
                  <Dropdown overlay={menu}>
                    <span className="goOutBtn">
                      <SettingOutlined />
                    </span>
                  </Dropdown>
								</Col>
							</Row>
						</Col>
					</Row>
				</Header>
				<Content>
					<div className="content-box">
						<div className="content-main">
							{props.location.pathname == "/home/dashboard.html" ? (
								<div>{props.children}</div>
							) : (
								<Card className="full">{props.children}</Card>
							)}
						</div>
					</div>
				</Content>
			</Layout>
		</Layout>
	)
	// )
}
export default LayoutHome
