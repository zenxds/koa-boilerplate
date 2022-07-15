import React, { createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form, message } from '@dx/xbee'
import { EyeInvisibleOutlined, EyeTwoTone } from '@dx/icons'

import { isPassword } from '@utils/validator'
import { unparam, verifyCaptcha } from '@utils'

import '../common.less'
import './styles.less'

@inject('userActions')
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      formHasError: true,
      loading: false,
    }

    this.params = unparam(location.search.substr(1))
    this.formRef = createRef()
  }

  async componentDidMount() {
    if (location.pathname === '/user/confirmReset') {
      const { u, token } = this.params
      const r = await this.props.userActions.confirmReset({
        u,
        token,
      })

      if (r === undefined) {
        location.href = '/user/login'
      }
    }
  }

  handleFieldsChange = () => {
    const formRef = this.formRef
    const hasError = this.hasError(formRef)

    this.setState({
      formHasError: hasError,
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

  handleBack = () => {
    location.href = '/user/login'
  }

  onFormFinish = async values => {
    const verifyToken = await verifyCaptcha()

    this.setState({
      loading: true,
    })

    const r = await this.props.userActions.resetPassword({
      password: values.password,
      verify_token: verifyToken,
      u: this.params.u,
      token: this.params.token,
    })

    this.setState({
      loading: false,
    })

    if (r) {
      message.success('修改密码成功')
      location.href = '/user/login'
    }
  }

  render() {
    const { formHasError, loading } = this.state

    return (
      <div styleName="form">
        <div styleName="reset-title">
          重设密码
          <div styleName="back" onClick={this.handleBack}></div>
        </div>
        <Form
          ref={this.formRef}
          onFinish={this.onFormFinish}
          onFieldsChange={this.handleFieldsChange}
        >
          <Form.Item
            name="password"
            rules={[
              {
                validator: async (rule, value) => {
                  if (!value) {
                    return Promise.resolve()
                  }

                  if (!isPassword(value)) {
                    return Promise.reject(new Error('密码格式不正确'))
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input.Password
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="请设置密码，6-20位，包含数字和字母"
            />
          </Form.Item>
          <Form.Item
            name="password2"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value && getFieldValue('password') === value) {
                    return Promise.resolve()
                  }

                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="再次输入新密码"
            />
          </Form.Item>
          <Button
            disabled={formHasError}
            type="primary"
            htmlType="submit"
            styleName="submit"
            loading={loading}
          >
            完成
          </Button>
        </Form>
      </div>
    )
  }
}
