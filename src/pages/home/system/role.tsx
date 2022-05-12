import { PageProps } from "@/interfaces/app.interface"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalCustom } from "@/components/modal/modal.context"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import { Button, Row, Col, Space, Modal, message } from "antd"
import { returnColumnFields } from "@/utils/column.fields"
import AddRole from "@/components/modal/system/addRole.modal"
import serviceSys from "@/services/service.sys"

const Role = (props: PageProps) => {
	const [params, setParams] = useState({})
	const pageIndex = useRef(1)
	const [list, setList] = useState([])
	const exportIndex = useCallback((index: number) => {
		pageIndex.current = index
	}, [])
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "id",
			key: "options",
			fixed: "right",
			width: 160,
			align: "center",
			render: (v: any, item: any) => {
				return (
					<Space size={10}>
						<Button size="middle" type="primary" onClick={handle(item.id)}>
							编辑
						</Button>
						{/* <Button size="middle" type="primary" onClick={setHandle(item.id)}>
							分配权限
						</Button> */}
						<Button size="middle" type="primary" danger onClick={deleteRole(item.id)}>
							删除
						</Button>
					</Space>
				)
			}
		}
	]
	// 删除角色
	const deleteRole = useCallback(
		(id: string) => () => {
			Modal.confirm({
				title: "删除角色",
				content: "是否删除该角色？",
				closable: true,
				onOk: () => {
					if (list.length === 1 && pageIndex.current > 1) {
						pageIndex.current = pageIndex.current - 1
					}
					serviceSys.deleteRole([id]).then(res => {
						if (res.code === 200) {
							eventBus.emit("doRoleInfo")
							Modal.destroyAll()
						} else {
							message.error("不能删除已关联账号的角色")
						}
					})
				}
			})
		},
		[list]
	)
	// 创建编辑角色
	const handle = (id: string) => () => {
		ModalCustom({
			content: AddRole,
			params: {
				id
			}
		})
	}

	// 抛出事件
	useEffect(() => {
		eventBus.on("doRoleInfo", () => setParams({ ...withParams.current, pageNum: pageIndex.current }))
		return () => {
			eventBus.off("doRoleInfo")
		}
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>角色列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle("")}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	return (
		<Row className="data-form full">
			{/* <Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["keyword"])} toSearch={setParams} />
			</Col> */}
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					exportIndex={exportIndex}
					exportData={list => {
						setList(list)
					}}
					columns={returnColumnFields(["sort", "roleName"]).concat(columns)}
					//正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
					apiService={serviceSys.getRole}
				/>
			</Col>
		</Row>
	)
}
Role.title = "角色管理"
export default Role
