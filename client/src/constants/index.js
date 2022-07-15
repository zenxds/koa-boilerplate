export const API_SERVER = window.API_SERVER || ''
export const CONSOLE_URL = window.API_CONSOLE_URL || ''
export const HOME_URL = window.API_HOME_URL || ''

export const CAPTCHA_APP_KEY = 'dxdxdxtest2017keyc3e83b6940835'

// 1注册 2找密 3修改密码 4修改绑定邮箱 5绑定手机号 6短信登陆 7获取价格方案 8渠道合作申请 9微信扫码绑定 10微信扫码注册
export const SMS_TYPES = {
  register: 1,
  forgetPassword: 2,
  changePassword: 3,
  resetEmail: 4,
  bindPhone: 5,
  smsLogin: 6,
  getPricePlan: 7,
  channelApply: 8,

  wxScanBind: 9,
  wxScanRegister: 10,
}
