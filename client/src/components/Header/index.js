import React, { Component, Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { Menu, Dropdown } from '@dx/xbee'
import { Icon } from '@dx/icons/compatible'

import paths from '@constants/paths'
import './less/styles.less'

@inject('userStore', 'userActions')
@observer
class Header extends Component {
  handleLogout = () => {
    location.href = paths.logout
  }

  render() {
    const { userStore } = this.props
    const menu = (
      <Menu>
        <Menu.Item key="1">
          <a onClick={this.handleLogout}>安全退出</a>
        </Menu.Item>
      </Menu>
    )

    return (
      <Fragment>
        <div styleName="header-info">
          <Dropdown overlay={menu} placement="bottomLeft">
            <div styleName="user-info">
              <a styleName="user-name" title={userStore.username}>
                {userStore.username}
                <Icon type="down" style={{ marginLeft: '3px' }} />
              </a>
            </div>
          </Dropdown>
        </div>
      </Fragment>
    )
  }
}

export default Header
