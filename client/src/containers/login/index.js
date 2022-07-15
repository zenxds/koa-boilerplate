import React, { Fragment, createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form, Spin } from '@dx/xbee'
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CheckCircleFilled,
} from '@dx/icons'
import {
  getLatestDailyData, // 获取日常接口最新的数据
  getLatestPublishData, // 获取线上接口最新的数据
} from 'dx-dms-sdk'
import QRCode from 'qrcode'

import { CONSOLE_URL, SMS_TYPES } from '@constants'
import { unparam, isMobileDevice, verifyCaptcha } from '@utils'
import { isEmail, isMobile } from '@utils/validator'
import SMSVerification from '@components/SMSVerification/item'
import '../common.less'
import './styles.less'

const SMS_TYPE = SMS_TYPES.smsLogin
const isDisableCaptcha = location.href.indexOf('disable_captcha') > -1

@inject('userActions')
@observer
export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // phone qrcode
      type: isMobileDevice() ? 'phone' : 'qrcode',

      openid: '',
      scene: '',
      qrcode: '',
      // 二维码是否过期
      overdue: false,

      phoneNumber: '',
      codeResult: null,

      passwordHasError: true,
      phoneHasError: true,

      loading: false,

      fifthData: { enable: 0 },
    }

    this.params = unparam(location.search.substr(1))

    this.passwordFormRef = createRef()
    this.phoneFormRef = createRef()
    this.sceneTimer = null
  }

  componentDidMount() {
    this.getScene()
    this.getFifthData()
  }

  async getFifthData() {
    let fifthData = { enable: 0 }
    try {
      const res =
        process.env.NODE_ENV === 'production'
          ? await getLatestPublishData(70)
          : await getLatestDailyData(70)
      if (res && res.success) {
        fifthData = res.data.jsonData['fifth-anniversary']
      }
    } catch (err) {
      console.log(err)
    }

    this.setState({
      fifthData,
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

  handleClickQRCode = () => {
    const { loading } = this.state
    if (loading) {
      return
    }

    this.getScene()
  }

  async getScene() {
    this.setState({
      overdue: false,
      loading: true,
    })

    try {
      const { userActions } = this.props
      const data = await userActions.getScene()
      // const oauthUrl = userActions.getOAuthUrl(data.scene)
      const qrcode = await QRCode.toDataURL(data.url)

      this.setState({
        scene: data.scene,
        qrcode,
        loading: false,
      })

      clearInterval(this.sceneTimer)
      this.sceneTimer = setInterval(() => {
        this.queryScene()
      }, 1000)
    } catch (err) {
      this.setState({
        loading: false,
      })
    }
  }

  async handleWXLogin(openid) {
    const { userActions } = this.props
    // 0:未绑定用户 ，1：已绑定用户，可直接跳转console
    const data = await userActions.wxLogin({ openid })

    if (data === 0) {
      location.href = '/user/bind?openid=' + encodeURIComponent(openid)
      return
    }

    if (data === 1) {
      this.handleLoginSuccess()
    }
  }

  async queryScene() {
    const { scene } = this.state
    const { userActions } = this.props
    const data = await userActions.queryScene({ scene })

    // 二维码已过期
    if (data.overdue) {
      this.setState({
        overdue: true,
      })
      clearInterval(this.sceneTimer)
      return
    }

    // 已扫码
    if (data.openid) {
      // 已经关注
      if (data.subscribe) {
        clearInterval(this.sceneTimer)
        this.handleWXLogin(data.openid)
      } else {
        this.setState({
          openid: data.openid,
        })
      }
    }
  }

  handleTypeChange(type) {
    this.setState({ type })

    if (type === 'qrcode') {
      if (this.state.scene) {
        this.sceneTimer = setInterval(() => {
          this.queryScene()
        }, 1000)
      }
    } else {
      clearInterval(this.sceneTimer)
    }
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.setState({ [type]: value })
  }

  handleLoginSuccess = () => {
    if (this.params['back_url']) {
      location.href = this.params['back_url']
      return
    }

    location.href = CONSOLE_URL
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
    const { loginName, password } = values

    if (isDisableCaptcha) {
      this.handleLogin({
        loginName,
        password,
      })
      return
    }

    const verifyToken = await verifyCaptcha()
    this.handleLogin({
      loginName: loginName,
      password: password,
      verify_token: verifyToken,
    })
  }

  onPhoneFormFinish = async values => {
    this.setState({
      loading: true,
    })

    values.type = SMS_TYPE
    const r = await this.props.userActions.smsLogin(values)

    this.setState({
      loading: false,
    })

    if (r) {
      this.handleLoginSuccess()
    }
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
        type={SMS_TYPE}
        onSuccess={this.onCodeSuccess}
      />
    )
  }

  renderExtra() {
    const registerUrl = this.params['back_url']
      ? `/user/bind?back_url=${encodeURIComponent(this.params['back_url'])}`
      : '/user/bind'

    return (
      <div styleName="more">
        <a styleName="link" href={registerUrl}>
          注册账号
        </a>
        {
          isMobileDevice() ? null : (
            <a
              styleName="qrcode-link"
              onClick={this.handleTypeChange.bind(this, 'qrcode')}
            >
              扫码登录
            </a>
          )
        }
      </div>
    )
  }

  renderPassword() {
    const { type, passwordHasError, loading } = this.state
    const { userActions } = this.props

    if (type !== 'password') {
      return null
    }

    return (
      <Form
        ref={this.passwordFormRef}
        onFinish={this.onPasswordFormFinish}
        onFieldsChange={this.handleFieldsChange.bind(this, 'password')}
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

                const r = await userActions.validUserExist(
                  isMobile(value)
                    ? {
                        phoneNumber: value,
                      }
                    : {
                        email: value,
                      },
                )

                if (r) {
                  return Promise.resolve()
                } else {
                  return Promise.reject(
                    new Error(
                      `该${isMobile(value) ? '手机号' : '邮箱'}尚未注册`,
                    ),
                  )
                }
              },
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入手机号或邮箱" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <div>
            <Input.Password
              prefix={<LockOutlined />}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="请输入密码"
            />
            {type === 'password' && (
              <a styleName="forget-password" href="/user/forgetPwd">
                忘记密码
              </a>
            )}
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

  renderPhone() {
    const { type, codeResult, phoneHasError, loading } = this.state
    const { userActions } = this.props

    if (type !== 'phone') {
      return null
    }

    return (
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

                const r = await userActions.validUserExist({
                  phoneNumber: value,
                })
                if (r) {
                  return Promise.resolve()
                } else {
                  return Promise.reject(new Error('该手机号尚未注册'))
                }
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
        <Button
          type="primary"
          htmlType="submit"
          styleName="submit"
          loading={loading}
          disabled={phoneHasError || !codeResult}
        >
          登 录
        </Button>
      </Form>
    )
  }

  renderQRCode() {
    const { qrcode, openid, overdue, loading } = this.state

    return (
      <div styleName="form">
        <div styleName="qrcode-title">扫码登录/注册</div>
        {openid ? (
          <Fragment>
            <div styleName="qrcode-success">
              <CheckCircleFilled />
              扫码成功
              <br />
              请关注公众号即可登录/注册
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div styleName="qrcode" onClick={this.handleClickQRCode}>
              {loading ? (
                <Spin />
              ) : (
                <img src={qrcode} styleName={overdue ? 'overdue' : ''} />
              )}
              {overdue && <div styleName="refresh" />}
            </div>
            {this.state.fifthData.enable ? (
              <div styleName="qrcode-fifth">微信扫码注册即享新人万元豪礼！</div>
            ) : (
              <div styleName="qrcode-tip">
                {overdue
                  ? '二维码已失效，请点击刷新重试'
                  : '请打开微信，扫描二维码'}
              </div>
            )}
          </Fragment>
        )}
        <div
          styleName="qrcode-toggle-login"
          onClick={this.handleTypeChange.bind(this, 'password')}
        >
          密码/短信登录
        </div>
      </div>
    )
  }

  render() {
    const { type } = this.state

    if (type === 'qrcode') {
      return this.renderQRCode()
    }

    return (
      <div styleName="form">
        <div styleName="login-title">
          <h2
            styleName={type === 'password' ? 'active' : ''}
            onClick={this.handleTypeChange.bind(this, 'password')}
          >
            密码登录
          </h2>
          <h2
            styleName={type === 'phone' ? 'active' : ''}
            onClick={this.handleTypeChange.bind(this, 'phone')}
          >
            短信登录
          </h2>
        </div>
        {this.renderPassword()}
        {this.renderPhone()}
        {this.renderExtra()}
      </div>
    )
  }
}
