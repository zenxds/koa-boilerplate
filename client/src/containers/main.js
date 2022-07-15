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

import paths from '@constants/paths'

const containerMap = {
  [paths.login]: 'login',
  [paths.register]: 'register'
}
const container = containerMap[location.pathname] || 'login'

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
        <div className="app-content">
          <Switch>
            <Route path="/" exact component={load(container)} />
            <Route path="/" component={load(container)} />
          </Switch>
        </div>
      </div>
    )
  }
}
