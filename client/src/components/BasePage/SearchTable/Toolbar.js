import { Component } from 'react'

export default class Toolbar extends Component {
  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.props.actions.mergeConditions('page', {
      [type]: value,
    })
  }

  // 搜索时才修改store的值触发下面Table的监听
  handleSearch = async () => {
    this.props.actions.merge({
      pageFetchId: new Date().getTime(),
    })
  }

  handleReset = () => {
    this.props.actions.resetConditions('page')
  }
}
