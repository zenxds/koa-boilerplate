import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import {
  // BrowserRouter as Router
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { Spin } from '@dx/xbee'

import loadable from '@loadable/component'
import paths from '@constants/paths'
import Main from './containers/main'

import './less/theme.less'
import '@dx/xpanda/xpanda.less'
import './less/app.less'

const containerMap = {
  [paths.login]: 'login',
  [paths.register]: 'register'
}
const container = containerMap[location.pathname]

function load(page) {
  return loadable(() => import(`./containers/${page}`), {
    fallback: (
      <div className="page-loading">
        <Spin />
      </div>
    ),
  })
}

@inject('userStore')
@observer
class App extends Component {
  render() {
    const { isLogin } = this.props.userStore

    return (
      <Router>
        <Switch>
          <Route path={paths.login} component={load('login')} />
          <Route path={paths.register} component={load('register')} />
          {
            container ? (
              <Route path="/" component={load(container)} />
            ) : (
              <Route
              path="/"
              render={props =>
                isLogin ? <Main {...props} /> : <Redirect to={paths.login} />
              }
            />
            )
          }
        </Switch>
      </Router>
    )
  }
}

export default App
