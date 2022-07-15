import React, { Fragment, createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form } from '@dx/xbee'
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@dx/icons'

import paths from '@constants/paths'
import { unparam } from '@utils'
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
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.setState({ [type]: value })
  }

  handleSuccess = () => {
    location.href = this.params.backUrl || paths.index
  }

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

  renderExtra() {
    const loginUrl = this.params.backUrl
      ? `${paths.login}?backUrl=${encodeURIComponent(this.params.backUrl)}`
      : paths.login

    return (
      <div styleName="more">
        <a styleName="link" href={loginUrl}>
          登录已有账号
        </a>
      </div>
    )
  }

  onPasswordFormFinish = async values => {
    const { userActions } = this.props
    const { username, password } = values
    const data = {
      username,
      password,
    }

    this.setState({
      loading: true,
    })
    const r = await userActions.register(data)
    this.setState({
      loading: false,
    })

    if (r) {
      this.handleSuccess()
    }
  }

  renderPassword() {
    const { passwordHasError, loading } = this.state

    return (
      <Fragment>
        <Form
          ref={this.passwordFormRef}
          onFinish={this.onPasswordFormFinish}
          onFieldsChange={this.handleFieldsChange.bind(this, 'password')}
          styleName="password-form"
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
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="请设置密码"
            />
          </Form.Item>

          <Form.Item
            name="password2"
            rules={[
              {
                validator: async (rule, value) => {
                  if (!value) {
                    return Promise.resolve()
                  }

                  const password = this.passwordFormRef.current.getFieldValue('password')
                  if (value !== password) {
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="请确认密码"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            styleName="submit"
            disabled={passwordHasError}
            loading={loading}
          >
            注 册
          </Button>
        </Form>
      </Fragment>
    )
  }

  render() {
    return (
      <Fragment>
        <div styleName="form">
          <h2 styleName="register-title">用户注册</h2>
          {this.renderPassword()}
        </div>
      </Fragment>
    )
  }
}
