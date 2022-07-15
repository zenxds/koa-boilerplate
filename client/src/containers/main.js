import { Component } from 'react'
import {
  // inject,
  observer,
} from 'mobx-react'
import {
  Switch,
  Route,
  // Redirect,
  withRouter,
} from 'react-router-dom'
import loadable from '@loadable/component'
import { Spin } from '@dx/xbee'

import Sidebar from '../components/Sidebar'

const paths = {
  '/': 'login',
  '/user/login': 'login',
  '/user/register': 'login',
  '/user/bind': 'register',
  '/user/forgetPwd': 'forgetPassword',
  '/user/resetPassword': 'resetPassword',
  '/user/confirmReset': 'resetPassword',
}
const container = paths[location.pathname] || paths['/']

function load(page) {
  return loadable(() => import(`./${page}`), {
    fallback: (
      <div className="page-loading">
        <Spin />
      </div>
    ),
  })
}

@withRouter
@observer
export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      year: new Date().getFullYear(),
    }
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-sidebar">
          <Sidebar />
        </div>
        <div className="app-content">
          <Switch>
            <Route path="/" exact component={load(container)} />
            <Route path="/" component={load(container)} />
          </Switch>
        </div>

        <div className="logo">
          <a href="https://www.dingxiang-inc.com/" title="顶象">顶象</a>
        </div>

        <div className="copyright">
          Copyright © { this.state.year } 北京顶象技术有限公司 版权所有 京ICP备17034357号
        </div>
      </div>
    )
  }
}
