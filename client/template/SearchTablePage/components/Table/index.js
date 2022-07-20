import React, { Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { Table, Tooltip, message } from '@dx/xbee'
import { DxFormModal, DxTableBtn } from '@dx/xpanda'

import Base from '@components/BasePage/SearchTable/Table'
import { pick, compact } from '@utils'

import ItemForm from '../ItemForm'

@inject('actions', 'store')
@observer
export default class PageTable extends Base {
  constructor(props) {
    super(props)

    this.state = {
      items: [],
      page: 1,
      pageSize: 10,
      itemCount: 0,

      editItem: null,
    }
  }

  fetchData = async (query = {}) => {
    const { store, actions } = this.props

    query = Object.assign(
      toJS(store.pageConditions),
      pick(['page', 'pageSize'], this.state),
      query,
    )

    actions.merge({
      loading: true,
    })
    const data = await actions.getList(compact(query))
    actions.merge({
      loading: false,
    })

    if (data) {
      this.setState(data)
    }
  }

  handleEditSuccess = value => {
    // 失败被request catch了
    if (value === undefined) {
      return
    }

    message.success('编辑成功')
    this.handleCancelEdit()
    this.fetchData()
  }

  handleEdit = record => {
    this.setState({
      editItem: record,
    })
  }

  handleCancelEdit = () => {
    this.setState({
      editItem: null,
    })
  }

  submitDelete = async record => {
    const r = await this.props.actions.deleteItem({
      id: record.id,
    })

    if (r) {
      message.success(`删除${record.name}成功`)
      this.props.actions.resetConditions('page')
    }
  }

  getColumns() {
    const { page, pageSize } = this.state

    return [
      {
        title: '序号',
        dataIndex: 'userId',
        render: (text, record, index) => {
          return (page - 1) * pageSize + index + 1
        },
      },
      {
        title: '名称',
        dataIndex: 'name',
        render: (name, record) => {
          if (record.desc) {
            return <Tooltip title={record.desc}>{name}</Tooltip>
          }

          return name
        },
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (id, record) => {
          return (
            <DxTableBtn.Group record={record}>
              <DxTableBtn type="edit" onClick={this.handleEdit} />
              <DxTableBtn
                type="delete"
                deleteTitle={`您确定要删除“${record.name}”吗`}
                onClick={this.submitDelete}
              />
            </DxTableBtn.Group>
          )
        },
      },
    ]
  }

  render() {
    const { loading } = this.props.store

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={this.getColumns()}
          size="small"
          rowKey={record => record.id}
          dataSource={this.getDataSource()}
          pagination={this.getPagination()}
        />
        {this.state.editItem ? (
          <DxFormModal
            dxWidthType="min"
            title="编辑"
            action={this.props.actions.editItem}
            onSuccess={this.handleEditSuccess}
            onCancel={this.handleCancelEdit}
          >
            <ItemForm data={this.state.editItem} />
          </DxFormModal>
        ) : null}
      </Fragment>
    )
  }
}
