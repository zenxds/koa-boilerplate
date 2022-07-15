import React, { createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form } from '@dx/xbee'
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@dx/icons'

import { ENABLE_CAPTCHA } from '@constants'
import paths from '@constants/paths'
import { unparam, verifyCaptcha } from '@utils'
import { isUsername, isPassword } from '@utils/validator'
import '../common.less'
import './styles.less'

@inject('userActions')
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      passwordHasError: true,
      loading: false,
    }

    this.params = unparam(location.search.substr(1))

    this.passwordFormRef = createRef()
    this.phoneFormRef = createRef()
  }

  componentDidMount() {}

  handleFieldsChange(type) {
    const formRef = this[type + 'FormRef']
    const hasError = this.hasError(formRef)

    this.setState({
      [type + 'HasError']: hasError,
    })
  }

  hasError(formRef) {
    if (!formRef.current) {
      return true
    }

    const errors = formRef.current.getFieldsError()
    const values = formRef.current.getFieldsValue()
    const keys = Object.keys(values)

    for (let i = 0; i < errors.length; i++) {
      if (errors[i].errors.length) {
        return true
      }
    }

    for (let i = 0; i < keys.length; i++) {
      if (!values[keys[i]]) {
        return true
      }
    }

    return false
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.setState({ [type]: value })
  }

  handleLoginSuccess = () => {
    location.href = this.params.backUrl || paths.index
  }

  handleLogin = async values => {
    this.setState({
      loading: true,
    })

    const r = await this.props.userActions.login(values)

    this.setState({
      loading: false,
    })

    if (r) {
      this.handleLoginSuccess()
    }
  }

  onPasswordFormFinish = async(values) => {
    const { username, password } = values

    if (!ENABLE_CAPTCHA) {
      this.handleLogin({
        username,
        password,
      })
      return
    }

    const verifyToken = await verifyCaptcha()
    this.handleLogin({
      username,
      password,
      token: verifyToken,
    })
  }

  renderExtra() {
    const registerUrl = this.params.backUrl
      ? `${paths.register}?backUrl=${encodeURIComponent(this.params.backUrl)}`
      : paths.register

    return (
      <div styleName="more">
        <a styleName="link" href={registerUrl}>
          注册账号
        </a>
      </div>
    )
  }

  renderPassword() {
    const { passwordHasError, loading } = this.state

    return (
      <Form
        ref={this.passwordFormRef}
        onFinish={this.onPasswordFormFinish}
        onFieldsChange={this.handleFieldsChange.bind(this, 'password')}
      >
        <Form.Item
          name="username"
          rules={[
            {
              validator: async (rule, value) => {
                if (!value) {
                  return Promise.resolve()
                }

                if (!isUsername(value)) {
                  return Promise.reject(new Error('请输入正确格式的用户名'))
                }

                return Promise.resolve()
              },
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              validator: async (rule, value) => {
                if (!value) {
                  return Promise.resolve()
                }

                if (!isPassword(value)) {
                  return Promise.reject(new Error('请输入正确格式的密码'))
                }

                return Promise.resolve()
              },
            },
          ]}
        >
          <div>
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="请输入密码"
            />
          </div>
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          styleName="login-submit"
          loading={loading}
          disabled={passwordHasError}
        >
          登 录
        </Button>
      </Form>
    )
  }

  render() {
    return (
      <div styleName="form">
        <h2 styleName="login-title">用户登录</h2>
        {this.renderPassword()}
        {this.renderExtra()}
      </div>
    )
  }
}
