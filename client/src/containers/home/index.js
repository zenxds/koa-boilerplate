import { Component } from 'react'
import { when } from 'mobx'
import { observer, inject } from 'mobx-react'

@inject('menuStore')
@observer
class Home extends Component {
  componentDidMount() {
    const { history } = this.props

    // 跳到第一个菜单页面
    when(
      () => this.props.menuStore.menus.length,
      () => {
        const { menus } = this.props.menuStore
        const firstPath = this.getFirstPath(menus)

        if (history.location.pathname !== firstPath) {
          history.push(firstPath)
        }
      },
    )
  }

  getFirstPath(menuList) {
    if (menuList[0].children && menuList[0].children.length) {
      return this.getFirstPath(menuList[0].children)
    }

    return menuList[0]['path']
  }

  render() {
    return null
  }
}

export default Home
