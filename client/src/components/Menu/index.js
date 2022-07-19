import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Menu } from '@dx/xbee'
import classnames from 'classnames'

import { menuIconMap } from './constants'
import './less/styles.less'

const { Item, SubMenu } = Menu

@inject('menuStore', 'menuActions', 'userStore', 'userActions')
@withRouter
@observer
class PageMenu extends Component {
  constructor(props) {
    super(props)

    this.state = {
      openKeys: [],
    }
  }

  async componentDidMount() {
    await this.props.menuActions.getMenus()

    this.setState({
      openKeys: this.getOpenKeys(),
    })
  }

  /**
   * 进入一些菜单之外的页面
   * 关联菜单仍然要高亮
   * 要把所有的可访问页面都归于一个菜单下
   *
   * 这里是应该高亮的菜单，不是真正的currentPath
   */
  getCurrentPath() {
    const { location, menuStore } = this.props
    const { pathMap } = menuStore
    const pathname = location.pathname

    for (let p in pathMap) {
      // 去掉/这种情况
      if (pathname.startsWith(p) && p !== '/') {
        return p
      }
    }

    return pathname
  }

  // 一个菜单展开时，它的父菜单也应该展开
  getOpenKeys() {
    const { menuStore } = this.props
    const { pathMap, parentMap } = menuStore
    const openKeys = []

    let current = pathMap[this.getCurrentPath()]
    let currentCode = current && current.code
    while (currentCode) {
      openKeys.push(currentCode)
      currentCode = parentMap[currentCode]
    }

    return openKeys
  }

  handleOpenChange = keys => {
    this.setState({
      openKeys: keys,
    })
  }

  handleClick = e => {
    const { location, history } = this.props
    const pathname = location.pathname
    const target = e.item.props.pathname

    if (pathname !== target) {
      history.push(target)
    }
  }

  renderIcon(code) {
    if (menuIconMap[code]) {
      return menuIconMap[code]
    }

    return (
      <i className={classnames('anticon', 'menu-icon', `menu-icon-${code}`)} />
    )
  }

  renderMenu(menus = []) {
    menus = menus.slice()

    return menus.map(menu => {
      if (menu.children && menu.children.length) {
        return (
          <SubMenu
            key={menu.code}
            title={
              <div>
                {menu.level == 1 ? this.renderIcon(menu.code) : null}
                <span>{menu.name}</span>
              </div>
            }
          >
            {this.renderMenu(menu.children)}
          </SubMenu>
        )
      }

      return (
        <Item
          key={menu.code}
          pathname={menu.path}
          className={`menu-level-${menu.level}`}
        >
          {menu.level == 1 ? this.renderIcon(menu.code) : null}
          <span>{menu.name}</span>
        </Item>
      )
    })
  }

  render() {
    const { menus } = this.props.menuStore
    const { openKeys } = this.state
    // 当前应当打开的菜单，当前路径的父路径都应该打开
    const defaultOpenKeys = this.getOpenKeys()

    if (!menus.length) {
      return null
    }

    return (
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[defaultOpenKeys[0]]}
        openKeys={openKeys}
        defaultOpenKeys={defaultOpenKeys}
        onClick={this.handleClick}
        onOpenChange={this.handleOpenChange}
      >
        {this.renderMenu(menus)}
      </Menu>
    )
  }
}

export default PageMenu
