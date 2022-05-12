import React, { useCallback, useEffect, useState, useRef } from "react"
import { PageProps } from "@/interfaces/app.interface"
import { ModalRef } from "@/components/modal/modal.context"
import { ModalCustom } from "@/components/modal/modal.context"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import { returnSearchFiels } from "@/utils/search.fields"
import serviceManage from "@/services/service.manage"
import { Row, Col, Space, Button, message, Popconfirm } from "antd"
import eventBus from "@/utils/event.bus"
import { ColumnType } from "antd/es/table/interface"
import AddDraw from "@/components/modal/manage/addDraw.modal"
import DrawNdList from "@/components/modal/manage/drawNdList.modal"
import Winners from "@/components/modal/manage/winners.modal"

const Draw = (props: PageProps & ModalRef) => {

    const [params, setParams] = useState({})
    const withParams = useRef<any>()

    const columns: ColumnType<any>[] = [
        {
            title: "操作",
            dataIndex: "id",
            key: "options",
            fixed: "right",
            width: 260,
            align: "center",
            render: (v: any, item: any) => {
                return (
                    <Space size={10}>
                        <Button size="middle" type="primary" onClick={() => addOrEdit(item.id)}>
                            编辑
                        </Button>
                        {item.state === 0 ? <Button onClick={() => enable(item.id)} size="middle" type="primary" >
                            启用
                        </Button> : null}
                        {item.state === 1 ? <Button onClick={() => disabled(item.id)} size="middle" type="primary" danger>
                            禁用
                        </Button> : null}
                        <Button size="middle" type="primary" onClick={() => openNd(item.id)}>
                            内定名单
                        </Button>
                        <Button size="middle" type="primary" onClick={() => openWins(item.id)}>
                            中奖名单
                        </Button>
                        <Popconfirm placement="topLeft" title="确定要删除当前活动么" onConfirm={() => detele(item.id)} okText="确定" cancelText="取消">
                            <Button size="middle" type="primary" danger  >
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                )
            }
        }
    ]

    const detele = useCallback((id) => {

        serviceManage.deleteDrawActivity({ id }).then(res => {
            if (res.code === 200) {
                message.success("删除成功")
                eventBus.emit('doDrawList')
            }
        })
    }, [])

    const enable = useCallback((id) => {
        serviceManage.enableDrawActivity({ id }).then(res => {
            if (res.code === 200) {
                message.success("操作成功")
                eventBus.emit('doDrawList')
            }
        })
    }, [])

    const disabled = useCallback((id) => {
        serviceManage.disabledDrawActivity({ id }).then(res => {
            if (res.code === 200) {
                message.success("操作成功")
                eventBus.emit('doDrawList')
            }
        })
    }, [])

    const openNd = useCallback((id) => {
        console.log(id)
        ModalCustom({
            content: DrawNdList,
            params: {
                id
            }
        })
    }, [])

    const openWins = useCallback((id) => {
        ModalCustom({
            content: Winners,
            params: {
                id
            }
        })
    }, [])

    useEffect(() => {
        withParams.current = params
    }, [params])

    // 抛出事件
    useEffect(() => {
        eventBus.on("doDrawList", () => setParams({ ...withParams.current }))
        return () => {
            eventBus.off("doDrawList")
        }
    }, [])

    const addOrEdit = useCallback((id?: string) => {
        console.log(id)
        ModalCustom({
            content: AddDraw,
            params: {
                id
            }
        })
    }, [])

    const titleRender = useCallback(
        () => (
            <Row justify="space-between" align="middle">
                <Col></Col>
                <Col>
                    <Space>
                        <Button type="primary" onClick={() => addOrEdit()}>
                            +创建抽奖活动
                        </Button>
                    </Space>
                </Col>
            </Row>
        ),
        []
    )

    return (<Row className="data-form full">
        <Col className="form-search" span={24}>
            <FormSearch
                fields={returnSearchFiels(["drawName", "drawState"])}
                toSearch={setParams}
                provideUrl={`/exhibition/activity/page`}
            />
        </Col>
        <Col className="form-result" span={24}>
            <ListTable
                title={titleRender}
                searchParams={params}
                columns={returnColumnFields(["sort", "drawName", "drawState", "creatorName", "createDate"]).concat(columns)}
                //正式使用补充相关的数据接口,直接传引用就行,相关的参数(包含分页参数)会自动传入接口调用中.
                apiService={serviceManage.getDrawList}
            />
        </Col>
    </Row>)
}


Draw.title = "抽奖活动"

export default Draw



