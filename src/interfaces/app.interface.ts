import { ModalFuncProps } from "antd/lib/modal"
import { History, Location } from "history-with-query"

export interface PageProps {
	children: React.NamedExoticComponent
	history: History
	location: Location
	match: RouteMatch
	route: RouteItem
	routes: RouteItem[]
	staticContext: any //服务端渲染会用
	item: any
}

export interface RouteItem {
	//排序字段
	sort?: number
	path: string
	component: React.NamedExoticComponent
	title?: string
	routes?: RouteItem[]
	exact?: boolean
	//图标字段
	icon?: string
	//是否显示在左侧菜单
	menu?: boolean
	link: string
}
// 菜单子项
export interface MenuItem {
	commonType: string
	icon: string
	id: number
	link: string
	permissions: string
	pid: number
	sort: number
	type: number
	name: string
}

// 菜单目录
export interface SubMenuItem<T> {
	childMenuList?: T[]
	commonType: string
	icon: string
	id: number
	link: string
	permissions: string
	pid: number
	sort: number
	type: number
	name: string
	title?: string
}

export interface RenderOpts {
	routes: RouteItem[]
	plugin: { hooks: RouteHooks; validKeys: string[] }
	history: History
	dynamicImport: boolean
	rootElement: string
	defaultTitle: string
}

export interface RouteHooks {
	modifyClientRenderOpts: any
	patchRoutes: any
	render: any
	onRouteChange: any
	rootContainer: any
}

export interface rootContainerParams {
	key: string
	ref: any
	props: {
		history: History
		routes: RouteItem[]
		plugin: { hooks: RouteHooks; validKeys: string[] }
		defaultTitle: string
	}
}

export interface RouteChangeParams {
	routes: RouteItem[]
	matchedRoutes: MatchedRoute[]
	location: Location
	action: string
}

export interface MatchedRoute {
	route: RouteItem
	match: RouteMatch
}
export interface RouteMatch {
	path: string
	url: string
	isExact: boolean
	params: any
}

export interface ModalReturn {
	destroy: () => void
	update: (configUpdate: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void
}
export interface rolesPermissionsItem {
	id: number
	permissionName: string
	description: string
	createTs: string
}
