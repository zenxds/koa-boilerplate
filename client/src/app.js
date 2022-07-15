import { Component } from 'react'
import { observer } from 'mobx-react'
import {
  // BrowserRouter as Router
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import Main from './containers/main'

import './less/theme.less'
import '@dx/xpanda/xpanda.less'
import './less/app.less'

@observer
class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/"
            render={props => <Main {...props} /> }
          />
        </Switch>
      </Router>
    )
  }
}

export default App
