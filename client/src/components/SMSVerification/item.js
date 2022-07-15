import React, { createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Button, Form, Modal, message } from '@dx/xbee'

import { SMS_TYPES } from '@constants'
import { verifyCaptcha } from '@utils'
import { isSMSCode, isMobile, } from '@utils/validator'

import './styles.less'

@inject('userActions')
@observer
export default class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      type: props.type,
      validBindResult: null,
      code: '',
      verifyToken: '',
      countDown: 0,
    }

    this.inputRef = createRef()
    this.timer = null
  }

  componentDidUpdate(prevProps) {
    // 重新输入了手机号
    if (this.props.phoneNumber && this.props.phoneNumber !== prevProps.phoneNumber) {
      this.setState({
        verifyToken: '',
      })
    }
  }


  startCountDown = () => {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    let countDown = 60
    this.timer = setInterval(() => {
      countDown--

      this.setState({
        countDown,
      })

      if (countDown === 0) {
        clearInterval(this.timer)
        this.timer = null
      }
    }, 1000)
  }

  validate = async(code) => {
    const { userActions, phoneNumber, openid, onSuccess } = this.props
    const { verifyToken, validBindResult, type } = this.state

    const valid = await userActions.validSMS({
      phoneNumber,
      type,
      code,
      openid,
    })

    if (valid === undefined) {
      return
    }

    // type=1 注册的时候不返回u和t
    let ret = { code, verifyToken, type, validBindResult }
    if (typeof valid === 'object') {
      ret = Object.assign(ret, valid)
    }

    onSuccess(ret)
  }

  handleChange = (type, event) => {
    const target = event && event.target
    const value = target ? target.value : event

    this.setState({ [type]: value })

    if (type === 'code' && isSMSCode(value)) {
      this.validate(value)
    }
  }

  resendCode = async () => {
    const { phoneNumber } = this.props
    const { verifyToken, type } = this.state

    this.setState({
      loading: true,
    })
    const r = await this.props.userActions.resendSMS({
      phoneNumber,
      verify_token: verifyToken,
      type,
    })
    this.setState({
      loading: false,
    })

    if (r) {
      this.startCountDown()
    }
  }

  sendCode = async() => {
    const { phoneNumber, openid } = this.props
    const { verifyToken, type } = this.state

    this.setState({
      loading: true,
    })
    const r = await this.props.userActions.sendSMS({
      phoneNumber,
      verify_token: verifyToken,
      type,
      openid,
    })
    this.setState({
      loading: false,
    })

    if (r) {
      message.success('验证码发送成功')
      this.startCountDown()
      this.inputRef.current?.focus()
    }
  }

  handleSendCode = async() => {
    if (this.state.verifyToken) {
      this.resendCode()
      return
    }

    // 0:未注册 ，1：注册未绑定，2：注册已绑定
    const { userActions, phoneNumber, openid } = this.props
    if (openid) {
      const r = await userActions.validBind({ phoneNumber })
      if (r) {
        this.setState({
          validBindResult: r,
        })

        if (r === 2) {
          Modal.error({
            content: '该手机号已经绑定了微信号',
          })
          return
        }

        if (r === 1) {
          this.setState({
            type: SMS_TYPES.wxScanBind
          })
        }
      }
    }

    const verifyToken = await verifyCaptcha()
    this.setState({
      verifyToken,
    }, () => {
      this.sendCode()
    })
  }

  render() {
    const { countDown, loading } = this.state
    const { phoneNumber } = this.props

    return (
      <Form.Item
        name="code"
        rules={[
          {
            validator: async (rule, value) => {
              if (!value) {
                return Promise.resolve()
              }

              if (!isSMSCode(value)) {
                return Promise.reject(new Error('请输入正确的短信验证码'))
              }

              return Promise.resolve()
            },
          },
        ]}
      >
        <div>
          <Input
            ref={this.inputRef}
            onChange={this.handleChange.bind(this, 'code')}
            prefix={<i styleName="sms-icon" />}
            autoComplete="off"
            maxLength={6}
            placeholder="请输入短信验证码"
          />
          <Button
            styleName="sms-btn"
            type="primary"
            // loading={loading}
            disabled={loading || countDown > 0 || !isMobile(phoneNumber)}
            onClick={this.handleSendCode}
          >
            {countDown > 0 ? `${countDown}S` : '发送验证码'}
          </Button>
        </div>
      </Form.Item>
    )
  }
}
