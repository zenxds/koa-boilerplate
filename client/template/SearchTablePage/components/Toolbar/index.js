import React, { Fragment } from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Input, Button, message } from '@dx/xbee'
import { DxFormModal, DxToolbar } from '@dx/xpanda'

import Base from '@components/BasePage/SearchTable/Toolbar'

import ItemForm from '../ItemForm'
import './styles.less'

@inject('actions', 'store')
@observer
export default class PageToolbar extends Base {
  static propTypes = {}

  constructor(props) {
    super(props)

    this.state = {
      showCreateModal: false,
    }
  }

  handleShowCreateModal = () => {
    this.setState({
      showCreateModal: true,
    })
  }

  handleHideCreateModal = () => {
    this.setState({
      showCreateModal: false,
    })
  }

  handleCreateSuccess = value => {
    // 失败被request catch了
    if (value === undefined) {
      return
    }

    message.success('新建成功')
    this.handleReset()
    this.handleHideCreateModal()
  }

  render() {
    const { store } = this.props
    const conditions = toJS(store.pageConditions)
    const { showCreateModal } = this.state

    return (
      <Fragment>
        <DxToolbar
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          loading={store.loading}
          extra={
            <Button type="primary" onClick={this.handleShowCreateModal}>
              新建
            </Button>
          }
        >
          <DxToolbar.Item label="名称">
            <Input
              onChange={this.handleChange.bind(this, 'name')}
              onPressEnter={this.handleSearch}
              allowClear
              value={conditions.name}
              placeholder="请输入名称"
            />
          </DxToolbar.Item>
        </DxToolbar>

        {showCreateModal ? (
          <DxFormModal
            dxWidthType="min"
            title="新建"
            action={this.props.actions.createItem}
            onSuccess={this.handleCreateSuccess}
            onCancel={this.handleHideCreateModal}
          >
            <ItemForm />
          </DxFormModal>
        ) : null}
      </Fragment>
    )
  }
}
