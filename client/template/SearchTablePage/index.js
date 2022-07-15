import { Component } from 'react'
// import { observer, inject } from 'mobx-react'
import { Layout } from '@dx/xbee'

import * as decorators from '@decorators'
import Toolbar from './components/Toolbar'
import Table from './components/Table'
import actions from './action'
import store from './store'
import './styles.less'

@decorators.errorBoundary
@decorators.provider({
  actions,
  store,
})
// @inject('actions')
// @observer
export default class Page extends Component {
  render() {
    return (
      <Layout.Main title="页面标题">
        <Toolbar />
        <Table />
      </Layout.Main>
    )
  }
}
