import { Component } from 'react'
import { reaction } from 'mobx'

export default class PageTable extends Component {
  componentDidMount() {
    this.initReaction()
  }

  componentWillUnmount() {
    this.disposer()
  }

  initReaction() {
    const { store } = this.props

    // fetchId变化时重新请求数据
    this.disposer = reaction(
      () => {
        return store.pageFetchId
      },
      () => {
        this.fetchData({
          page: 1,
        })
      },
      {
        fireImmediately: true,
      },
    )
  }

  handlePageChange = async (page, pageSize) => {
    return this.fetchData({ page, pageSize })
  }

  getDataSource() {
    const { items } = this.state
    return items.slice()
  }

  getPagination() {
    const { page, pageSize, itemCount } = this.state

    return {
      size: 'small',
      current: page,
      total: itemCount,
      pageSize: pageSize,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: this.handlePageChange,
      onShowSizeChange: this.handlePageChange,
    }
  }
}
