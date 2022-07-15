import React, { Fragment, createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form } from '@dx/xbee'

import { SMS_TYPES } from '@constants'
import { unparam, verifyCaptcha } from '@utils'
import { isMobile, isEmail } from '@utils/validator'
import SMSVerification from '@components/SMSVerification'

import '../common.less'
import './styles.less'

@inject('userActions')
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // loginName code success
      step: 'loginName',

      loginName: '',
      verifyToken: '',

      loginNameHasError: true,
      // codeHasError: true,

      loading: false,
    }

    this.params = unparam(location.search.substr(1))
    this.loginNameFormRef = createRef()
    this.smsType = SMS_TYPES.forgetPassword
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.setState({ [type]: value })
  }

  handleBack = () => {
    location.href = '/user/login'
  }

  goToStep(step) {
    this.setState({
      step,
    })
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

  onLoginNameFormFinish = async() => {
    const { userActions } = this.props
    const { loginName } = this.state
    const verifyToken = await verifyCaptcha()

    this.setState({
      verifyToken: verifyToken,
      loading: true,
    })

    if (isEmail(loginName)) {
      const r = await userActions.forgetPassword({
        loginName,
        verify_token: verifyToken
      })

      this.setState({
        loading: false,
      })

      if (r) {
        this.goToStep('success')
      }
    }

    if (isMobile(loginName)) {
      const r = await this.props.userActions.sendSMS({
        phoneNumber: loginName,
        verify_token: verifyToken,
        type: this.smsType,
      })

      this.setState({
        loading: false,
      })

      if (r) {
        this.goToStep('code')
      }
    }
  }

  renderLoginName() {
    const { step, loginNameHasError, loading } = this.state
    const { userActions } = this.props

    if (step !== 'loginName') {
      return null
    }

    return (
      <Fragment>
        <div styleName="forget-title">
          忘记密码
          <div
            styleName="back"
            onClick={this.handleBack}
          ></div>
        </div>
        <Form
          ref={this.loginNameFormRef}
          onFinish={this.onLoginNameFormFinish}
          onFieldsChange={this.handleFieldsChange.bind(this, 'loginName')}
        >
          <Form.Item
            name="loginName"
            rules={[
              {
                validator: async (rule, value) => {
                  if (!value) {
                    return Promise.resolve()
                  }

                  if (!isMobile(value) && !isEmail(value)) {
                    return Promise.reject(new Error('请输入正确的手机号或邮箱'))
                  }

                  const r = await userActions.validUserExist(isMobile(value) ? {
                    phoneNumber: value,
                  } : {
                    email: value
                  })

                  if (r) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject(new Error(`该${isMobile(value) ? '手机号' : '邮箱'}尚未注册`))
                  }
                },
              },
            ]}
          >
            <Input placeholder="请输入手机号或邮箱" onChange={this.handleChange.bind(this, 'loginName')} />
          </Form.Item>
          <Button
            disabled={loginNameHasError}
            type="primary"
            htmlType="submit"
            styleName="submit"
            loading={loading}
          >
            下一步
          </Button>
        </Form>
      </Fragment>
    )
  }

  onCodeSuccess = async values => {
    location.href = '/user/resetPassword' + '?u=' + encodeURIComponent(values.u) + '&token=' + encodeURIComponent(values.t)
  }

  renderCode() {
    const { step, loginName, verifyToken } = this.state

    if (step !== 'code') {
      return null
    }

    return (
      <SMSVerification
        phoneNumber={loginName}
        verifyToken={verifyToken}
        type={this.smsType}
        onSuccess={this.onCodeSuccess}
      />
    )
  }

  renderSuccess() {
    const { step } = this.state

    if (step !== 'success') {
      return null
    }

    return (
      <Fragment>
        <div styleName="forget-success">
          <h3 styleName="form-title">密码重置邮件已发送</h3>
          <p>一封密码重置邮件已发送至 <em>{this.state.loginName}</em>请登录该邮箱查收，并按照提示操作</p>
          <a
            className="xbee-btn xbee-btn-primary"
            href="/user/login"
          >
            返回登录页面
          </a>
        </div>
      </Fragment>
    )
  }

  render() {
    return (
      <div styleName="form">
        {this.renderLoginName()}
        {this.renderCode()}
        {this.renderSuccess()}
      </div>
    )
  }
}
