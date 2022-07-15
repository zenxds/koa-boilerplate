import { Component } from 'react'
import { Provider } from 'mobx-react'

export default (injectData = {}) => {
  return WrappedComponent => {
    class InjectedComponent extends Component {
      render() {
        return (
          <Provider {...injectData}>
            <WrappedComponent {...this.props} />
          </Provider>
        )
      }
    }

    return InjectedComponent
  }
}
