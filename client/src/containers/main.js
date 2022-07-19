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
import { Spin, Result } from '@dx/xbee'

import paths from '@constants/paths'
import Header from '@components/Header'
import Menu from '@components/Menu'

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

    this.state = {}
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-menu">
          <Menu />
        </div>
        <div className="app-wrapper">
          <div className="app-header">
            <Header />
          </div>
          <div className="app-content">
            <Switch>
              <Route exact path={paths.index} component={load('dashboard')} />
              <Route path="/">
                <Result status="404" />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    )
  }
}
