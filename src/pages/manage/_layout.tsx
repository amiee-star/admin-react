import { userContext } from "@/components/provider/user.context"
import { PageProps, RouteItem, SubMenuItem, MenuItem } from "@/interfaces/app.interface"
import { Card, Col, Layout, Menu, PageHeader, Row } from "antd"
import { Route } from "antd/lib/breadcrumb/Breadcrumb"
import SubMenu from "antd/lib/menu/SubMenu"
import { ModalRef } from "@/components/modal/modal.context"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import "./_layout.less"
import { HomeOutlined } from "@ant-design/icons"
import serviceManage from "@/services/service.manage"
const { Sider, Header, Content } = Layout

const LayoutHome = (props: PageProps & ModalRef) => {
	const { location, history, route } = props
	const { state, dispatch } = useContext(userContext)
	const exhibitionId = location.search.split("exhibitionId=")[1]

	useEffect(() => {
		!state.user && history.replace(`/auth/login.html?redirect=${location.pathname + location.search}`)
	}, [state])
	useEffect(() => {
		if (!!exhibitionId) {
			serviceManage.getExhibitionMenus({ exhibitionId }).then(res => {
				if (res.code === 200) {
					// console.log(res.data)

					dispatch({
						type: "getMenus",
						payload: {
							showMenus: res.data
						}
					})
				}
			})
		}
	}, [])

	const goToWelcomePage = () => () => {
		props.history.push({
			pathname: `/manage/welcomePage.html`,
			query: {
				exhibitionId
			}
		})
	}

	const renderMenu = useCallback(
		(menus: SubMenuItem<MenuItem>[]) => {
			return (
				menus &&
				menus[0] &&
				menus.map(item => {
					if (item.childMenuList && item.childMenuList.length) {
						return <SubMenu key={item.link} title={item.title}></SubMenu>
					} else {
						return <Menu.Item key={item.link}>{item.title}</Menu.Item>
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
		history.push(params.key + "?exhibitionId=" + exhibitionId)
	}, [])
	const [open, setOpen] = useState(getDefault.map(m => m.path))
	const onOpenChange = useCallback((e: React.ReactText[]) => setOpen(e.splice(-1).map(m => m.toString())), [])

	return (
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
						{state.showMenus && renderMenu(state.showMenus)}
					</Menu>
				</div>
			</Sider>
			<Layout>
				<Header>
					<Row justify="space-between" align="middle" gutter={10}>
						<Col span={24}>
							<Row justify="space-between" align="middle">
								<Col>
									<HomeOutlined style={{ fontSize: "20px", marginRight: "15px" }} onClick={goToWelcomePage()} />
									您本次登录的时间 : {state?.user?.loginDate}
								</Col>
								<Col className="head-img">你好，{state?.user?.username}，欢迎来到管理后台！</Col>
							</Row>
						</Col>
					</Row>
				</Header>
				<Content>
					<div className="content-box">
						{getDefault.length > 0 && (
							<div className="content-head">
								<PageHeader
									title={""}
									breadcrumb={{
										routes: Array.from(getDefault).reverse(),
										itemRender: e => <span>{e.breadcrumbName}</span>
									}}
								/>
							</div>
						)}
						<div className="content-main">
							{props.location.pathname == "/manage/welcomePage.html" ? (
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
}
export default LayoutHome
