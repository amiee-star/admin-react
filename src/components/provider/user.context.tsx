import { Dispatch, createContext, useReducer } from "react"
import React from "react"
import lsFunc from "@/utils/ls.func"
import { Authority, userData, UserRole, ExhibitionMenus } from "@/interfaces/api.interface"

interface StateContext {
	user?: any
	authorities?: Authority[]
	userRoles?: UserRole[]
	showMenus?: ExhibitionMenus[]
}

interface StateAction {
	state: StateContext
	dispatch: Dispatch<userDispatch>
}

type userDispatchType = "set" | "clear" | "getMenus"

interface userDispatch {
	type: userDispatchType
	payload?: StateContext
}

export const userContext = createContext<StateAction>({ state: {}, dispatch: () => {} })

const reducer = (preState: StateContext, params: userDispatch) => {
	switch (params.type) {
		case "clear":
			lsFunc.removeItem("user")
			return {}
		case "set":
			const newState = { ...preState, ...params.payload }
			lsFunc.setItem("user", newState.user)
			return newState
		case "getMenus":
			const state = { ...preState, ...params.payload }

			return state
		default:
			return preState
	}
}

const UserProvider: React.FC = props => {
	const [state, dispatch] = useReducer(reducer, lsFunc.getItem("user") ? { user: lsFunc.getItem("user") } : {})

	return <userContext.Provider value={{ state, dispatch }}>{props.children}</userContext.Provider>
}

export default UserProvider
