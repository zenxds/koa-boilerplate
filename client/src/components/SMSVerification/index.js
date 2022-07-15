import React, { Fragment, createRef } from 'react'
import { inject, observer } from 'mobx-react'
import { Input, Row, Col, Form, message } from '@dx/xbee'

import { isSMSCode } from '@utils/validator'

import './styles.less'

@inject('userActions')
@observer
export default class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      countDown: 0,
    }

    this.codeFormRef = createRef()
    this.codesRef = [
      createRef(),
      createRef(),
      createRef(),
      createRef(),
      createRef(),
      createRef(),
    ]
    this.timer = null
  }

  componentDidMount() {
    this.codesRef[0].current?.focus()
    this.startCountDown()
  }

  startCountDown = () => {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    let countTime = 60
    this.timer = setInterval(() => {
      countTime--

      this.setState({
        countDown: countTime,
      })

      if (countTime === 0) {
        clearInterval(this.timer)
        this.timer = null
        return
      }
    }, 1000)
  }

  handleResend = async () => {
    const { phoneNumber, verifyToken, type } = this.props
    const { countDown, loading } = this.state

    if (countDown > 0 || loading) {
      return
    }

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

  onCodeFormFinish = async values => {
    const { userActions, phoneNumber, type, openid, onSuccess } = this.props
    const code = values.code.join('')

    if (!isSMSCode(code)) {
      message.error('请输入正确的短信验证码')
      return
    }

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
    let ret = { code }
    if (typeof valid === 'object') {
      ret = Object.assign(ret, valid)
    }

    onSuccess(ret)
  }

  handleCodeChange(index, e) {
    const { value } = e.target
    const length = this.codesRef.length

    if (value) {
      if (index < length - 1) {
        this.codesRef[index + 1].current?.focus()
      } else {
        this.codeFormRef.current?.submit()
      }
    }
  }

  render() {
    const { countDown } = this.state
    const { phoneNumber } = this.props
    const { codesRef } = this

    return (
      <Fragment>
        <div styleName="sms-title">
          输入验证码
        </div>
        <div styleName="send-to">
          已发送至 <em>{phoneNumber}</em>
        </div>
        <Form
          ref={this.codeFormRef}
          onFinish={this.onCodeFormFinish}
          styleName="code-form"
        >
          <Row gutter={8}>
            {codesRef.map((ref, index) => {
              return (
                <Col key={index} span={4}>
                  <Form.Item name={['code', index]}>
                    <Input
                      ref={ref}
                      styleName="code-item"
                      maxLength={1}
                      onChange={this.handleCodeChange.bind(this, index)}
                    />
                  </Form.Item>
                </Col>
              )
            })}
          </Row>
        </Form>
        <div styleName="more">
          {countDown > 0 ? (
            <span>
              <a>{countDown}秒</a>后重新获取
            </span>
          ) : (
            <a onClick={this.handleResend}>
              重新获取验证码
            </a>
          )}
        </div>
      </Fragment>
    )
  }
}
