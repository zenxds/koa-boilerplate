import { message, Modal } from '@dx/xbee'
import axios from 'axios'

import { API_SERVER } from '@constants'
import { param, isPlainObject, compact } from './lang'

axios.defaults.baseURL = API_SERVER
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'

const messageMap = {
  'request error': '请求失败，请稍后重试',
  'Network Error': '网络出错，请检查您的网络状况',
  'Request failed with status code 502': '服务器出小差了，请稍后重试',
}

// 注释的以message提示，非注释的confirm提示
const errorCodeMap = {
  '-1001': '操作失败，请重试',
  '-1002': '密码错误次数过多，账户已被锁定，请明天再试！',
  '-1003': '多次密码错误可能导致账户被锁定！如忘记密码可以试试找回密码',
  // '-1004': '账号或密码不正确',
  // '-1005': '该手机号尚未注册',
  // '-1006': '手机号码已注册',
  // '-1007': '验证码已失效，请重新获取',
  // '-1008': '请输入正确验证码',
  '-1009': '重试次数太多，请稍后再试',
  '-1010': '短信验证码已被使用',
  '-1011': '发送失败，短信类型不正确',
  '-1012': '当日发送短信次数已达上限',
  '-1013': '短信发送失败',
  '-1014': '短信发送间隔时间过短，请稍后再试',
  '-1015': '发送失败，页面停留时间过长',
  '-1016': '注册失败，请重新注册',
  '-1017': '抱歉，因为一个未知错误，导致邮件发送失败，请稍后再试',
  '-1018': '重置链接已失效，请重新获取',
  '-1019': '重置密码失败，请重试！',
  // '-1020': '用户不存在',
  // '-1021': '手机号码不能为空'
}

export default function request(config = {}) {
  config = Object.assign(
    {
      // catchError为自定义配置，是否捕获错误
      catchError: true,
      // 是否返回整个response data，默认返回接口里的data字段
      returnResponseData: false,
      withCredentials: true,
      timeout: 30 * 1000,
    },
    config,
  )

  const ret = axios(config).then(response => {
    const { success, data, message } = response.data

    if (success) {
      // 后端有的success没有返回data，默认给个true
      return config.returnResponseData ? response.data : (data === undefined ? true : data)
    } else {
      throw new Error((errorCodeMap[data] ? data : message) || '请求失败')
    }
  })

  if (config.catchError) {
    return ret.catch(err => {
      if (errorCodeMap[err.message]) {
        return new Promise(resolve => {
          Modal.confirm({
            title: errorCodeMap[err.message],
            onOk() {
              resolve()
            },
            onCancel() {
              resolve()
            },
          })
        })
      } else {
        message.error(messageMap[err.message] || err.message)
      }
    })
  }

  return ret
}

// https://github.com/axios/axios/blob/master/lib/core/Axios.js
export function get(url, params = {}, config = {}) {
  return request(
    Object.assign(config, {
      method: 'get',
      url,
      params: compact(params),
    }),
  )
}

export function post(url, data, config = {}) {
  if (isPlainObject(data)) {
    data = param(compact(data))
  }

  return request(
    Object.assign(config, {
      method: 'post',
      url,
      data,
    }),
  )
}
