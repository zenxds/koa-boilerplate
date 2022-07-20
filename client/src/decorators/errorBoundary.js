import { Component } from 'react'
import { Result } from '@dx/xbee'

export default WrappedComponent => {
  class ErrorBoundary extends Component {
    constructor(props) {
      super(props)

      this.state = {
        hasError: false,
      }
    }

    componentDidCatch(error, info) {
      this.setState({
        hasError: true,
        error,
        info,
      })
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{ padding: 20, height: '100%', background: '#fff' }}>
            <Result
              status="error"
              title="抱歉！系统发生未知错误，请您稍后重试"
              subTitle={this.state.error + ''}
            />
          </div>
        )
      }

      return <WrappedComponent {...this.props} />
    }
  }

  return ErrorBoundary
}
