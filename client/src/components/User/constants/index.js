import { HOME_URL } from '@constants'

export const API_LOGIN = '/user/v2/login'
export const API_SMS_LOGIN = '/user/v2/smsLogin'
export const API_SEND_SMS = '/user/sendSMS'
export const API_RESEND_SMS = '/user/retry'
export const API_VALID_SMS = '/user/validCode'
export const API_USER_EXIST = '/user/validUserExist'

export const API_REGISTER = '/user/v2/register'
export const API_FORGET_PASSWORD = '/user/v2/forgetPwd'
export const API_RESET_PASSWORD = '/user/v2/resetPassword'
export const API_CONFIRM_RESET = '/user/v2/confirmReset'

export const API_WX_LOGIN = '/user/v2/login/openid'
export const API_VALID_BIND = '/user/v2/validBind'
export const API_BIND_PHONE = '/user/v2/phone/bind'

export const API_GET_SCENE = HOME_URL + '/weixin/api/getScene'
export const API_QUERY_SCENE = HOME_URL + '/weixin/api/queryScene'
