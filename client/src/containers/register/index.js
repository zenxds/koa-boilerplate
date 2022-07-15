import React, { Fragment, createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form, message } from '@dx/xbee'
import { EyeInvisibleOutlined, EyeTwoTone } from '@dx/icons'

import { CONSOLE_URL, HOME_URL, SMS_TYPES } from '@constants'
import { unparam, getWordFromReferer, isMobileDevice } from '@utils'
import * as cookie from '@utils/cookie'
import { isMobile, isPassword } from '@utils/validator'
import SMSVerification from '@components/SMSVerification/item'
import privacyContent from './privacy.html'
import termsContent from './terms.html'
import '../common.less'
import './styles.less'

@inject('userActions')
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // phone password
      step: 'phone',
      // company personal
      passwordType: 'company',

      phoneNumber: '',
      codeResult: null,

      phoneHasError: true,
      passwordHasError: true,

      privacyVisible: false,
      termsVisible: false,
      loading: false,
    }

    this.params = unparam(location.search.substr(1))
    this.isBind = /bind/.test(location.pathname) && this.params.openid
    this.registerType = this.isBind ? 'bind' : 'register'
    this.registerText = this.isBind ? '绑定' : '注册'
    this.phoneFormRef = createRef()
    this.passwordFormRef = createRef()
    this.smsType = this.isBind ? SMS_TYPES.wxScanRegister : SMS_TYPES.register
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.setState({ [type]: value })
  }

  goToStep(step) {
    this.setState({
      step,
    })
  }

  handleSuccess = () => {
    if (this.params['back_url']) {
      location.href = this.params['back_url']
      return
    }

    location.href = isMobileDevice()
      ? HOME_URL + '/about/register-success'
      : CONSOLE_URL
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

  onPhoneFormFinish = async() => {
    const { phoneNumber, codeResult } = this.state
    const { userActions } = this.props
    const { openid } = this.params

    // 0:未注册 ，1：注册未绑定，2：注册已绑定
    if (this.isBind && codeResult.validBindResult === 1) {
      message.info('账号绑定中，请稍候')
      this.setState({
        loading: true,
      })
      const r = await userActions.bindPhone({
        phoneNumber,
        openid,
        t: codeResult.t,
      })
      this.setState({
        loading: false,
      })
      if (r) {
        this.handleSuccess()
      }
    } else {
      this.goToStep('password')
    }
  }

  renderExtra() {
    const loginUrl = this.params['back_url']
      ? `/user/login?back_url=${encodeURIComponent(this.params['back_url'])}`
      : '/user/login'

    return (
      <div styleName="more">
        <a styleName="link" href={loginUrl}>
          登录已有账号
        </a>
      </div>
    )
  }

  renderPhone() {
    const { step, phoneHasError, codeResult, loading } = this.state
    const { userActions } = this.props

    if (step !== 'phone') {
      return null
    }

    return (
      <Fragment>
        <div styleName="register-title">
          {this.isBind ? '绑定手机号' : '免费注册'}
        </div>
        <Form
          ref={this.phoneFormRef}
          onFinish={this.onPhoneFormFinish}
          onFieldsChange={this.handleFieldsChange.bind(this, 'phone')}
        >
          <Form.Item
            name="phoneNumber"
            rules={[
              {
                validator: async (rule, value) => {
                  if (!value) {
                    return Promise.resolve()
                  }

                  if (!isMobile(value)) {
                    return Promise.reject(new Error('请输入正确的手机号'))
                  }

                  if (this.registerType === 'register') {
                    const r = await userActions.validUserExist({
                      phoneNumber: value,
                    })
                    if (r) {
                      return Promise.reject(new Error('该手机号已经注册'))
                    }
                  }

                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input
              prefix="+86"
              placeholder="请输入手机号"
              onChange={this.handleChange.bind(this, 'phoneNumber')}
            />
          </Form.Item>
          { this.renderCode() }
          <p styleName="agree">
            {this.registerText}代表您已同意顶象
            <a onClick={this.showAgreement.bind(this, 'terms')}>服务条款</a>和
            <a onClick={this.showAgreement.bind(this, 'privacy')}>隐私协议</a>
          </p>
          <Button
            disabled={phoneHasError || !codeResult}
            type="primary"
            htmlType="submit"
            styleName="submit"
            loading={loading}
          >
            下一步
          </Button>
        </Form>

        {this.renderExtra()}
      </Fragment>
    )
  }

  onCodeSuccess = result => {
    this.setState({
      codeResult: result,
    })
  }

  renderCode() {
    const { phoneNumber } = this.state

    return (
      <SMSVerification
        phoneNumber={phoneNumber}
        type={this.smsType}
        openid={this.params.openid}
        onSuccess={this.onCodeSuccess}
      />
    )
  }

  handleTogglePasswordType = () => {
    this.setState(({ passwordType }) => ({
      passwordType: passwordType === 'company' ? 'personal' : 'company',
    }))
  }

  onPasswordFormFinish = async values => {
    const { userActions } = this.props
    const { passwordType, codeResult, phoneNumber } = this.state
    const { verifyToken, code, type } = codeResult
    const { name, password } = values
    const data = {
      type,
      phoneNumber,
      password,
      code,
      corporationName: passwordType === 'personal' ? `个人用户: ${name}` : name,
      c: verifyToken && verifyToken.split(':')[1],
      source: this.params.from || cookie.get('dx_from') || '',
      referer: this.params.referrer || cookie.get('dx_referer') || '',
    }

    let semData = {}
    try {
      semData = JSON.parse(cookie.get('dx_sem') || '{}')
      Object.keys(semData).forEach(key => {
        semData[key] = decodeURIComponent(semData[key])
      })
    } catch (e) {
      semData = {}
    }

    data.searchSource = this.params.source || semData.searchSource || ''
    data.unit = this.params.unit || semData.unit || ''
    data.device = this.params.device || semData.device || ''
    data.keyword = this.params.keyword || semData.keyword || ''
    data.plan = this.params.plan || semData.plan || ''
    data.searchWord = getWordFromReferer(data.referer)
    // 百度线索API
    data.logidUrl = decodeURIComponent(cookie.get('logidUrl') || '')

    if (this.params.openid) {
      data.openid = this.params.openid
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
    const { step, passwordType, passwordHasError, loading } = this.state
    const passwordTypeMap = {
      company: '企业用户',
      personal: '个人用户',
    }

    if (step !== 'password') {
      return null
    }

    return (
      <Fragment>
        <div styleName="register-title-password">
          即将完成{this.registerText}！
        </div>
        <div styleName="password-type">
          <span styleName="current">{passwordTypeMap[passwordType]}</span>
          <span styleName="toggle" onClick={this.handleTogglePasswordType}>
            我是
            <em>
              {
                passwordTypeMap[
                  passwordType === 'company' ? 'personal' : 'company'
                ]
              }
            </em>
          </span>
        </div>
        <Form
          ref={this.passwordFormRef}
          onFinish={this.onPasswordFormFinish}
          onFieldsChange={this.handleFieldsChange.bind(this, 'password')}
          styleName="password-form"
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message:
                  '请输入' +
                  (passwordType === 'company' ? '公司名称' : '您的姓名'),
              },
            ]}
          >
            <Input
              placeholder={
                '请填写' +
                (passwordType === 'company' ? '公司名称' : '您的姓名')
              }
            />
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
          <Button
            type="primary"
            htmlType="submit"
            styleName="submit"
            disabled={passwordHasError}
            loading={loading}
          >
            完 成
          </Button>
        </Form>
      </Fragment>
    )
  }

  showAgreement(type) {
    this.setState({
      [type + 'Visible']: true,
    })
  }

  hideAgreement(type) {
    this.setState({
      [type + 'Visible']: false,
    })
  }

  renderTerms() {
    const { termsVisible } = this.state

    if (!termsVisible) {
      return null
    }

    return (
      <div styleName="agreement">
        <h2>顶象服务条款</h2>
        <div styleName="agreement-content">
          <div dangerouslySetInnerHTML={{ __html: termsContent }} />
        </div>
        <Button
          type="primary"
          styleName="agreement-close"
          onClick={this.hideAgreement.bind(this, 'terms')}
        >
          关闭
        </Button>
      </div>
    )
  }

  renderPrivacy() {
    const { privacyVisible } = this.state

    if (!privacyVisible) {
      return null
    }

    return (
      <div styleName="agreement">
        <h2>顶象隐私协议</h2>
        <div styleName="agreement-content">
          <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
        </div>
        <Button
          type="primary"
          styleName="agreement-close"
          onClick={this.hideAgreement.bind(this, 'privacy')}
        >
          关闭
        </Button>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        <div styleName="form">
          {this.renderPhone()}
          {this.renderPassword()}
        </div>
        {this.renderTerms()}
        {this.renderPrivacy()}
      </Fragment>
    )
  }
}
