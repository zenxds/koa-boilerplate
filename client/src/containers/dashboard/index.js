import { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Layout } from '@dx/xbee'

import * as decorators from '@decorators'
import actions from './actions'
import store from './store'

@decorators.provider({
  actions,
  store,
})
@inject('actions', 'store')
@observer
export default class Dashboard extends Component {
  render() {
    return <Layout.Main title="总览" />
  }
}
