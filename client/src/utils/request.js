import { message, Modal } from '@dx/xbee'
import axios from 'axios'

import { API_SERVER } from '@constants'
import { param, isPlainObject, compact } from './lang'

const instance = axios.create({
  baseURL: API_SERVER
})

instance.defaults.headers.common['csrf-token'] = window.csrf || ''
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const messageMap = {
  'request error': '请求失败，请稍后重试',
  'Network Error': '网络出错，请检查您的网络状况',
  'Request failed with status code 502': '服务器出小差了，请稍后重试',
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

  const ret = instance(config).then(response => {
    const { success, data, message } = response.data

    if (success) {
      // 后端有的success没有返回data，默认给个true
      return config.returnResponseData ? response.data : (data === undefined ? true : data)
    } else {
      throw new Error(message || '请求失败')
    }
  })

  if (config.catchError) {
    return ret.catch(err => {
      // 以-开头的错误，如-1001
      if (err.message.charAt(0) === '-') {
        return new Promise(resolve => {
          Modal.error({
            title: err.message,
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
