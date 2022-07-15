import React from 'react'
import { inject, observer } from 'mobx-react'

import './styles.less'

@inject('userActions')
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      year: new Date().getFullYear(),
    }
  }

  render() {
    return (
      <div styleName="bg"></div>
    )
  }
}
