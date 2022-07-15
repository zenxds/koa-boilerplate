/**
 * cookie module
 * export get/set/remove
 */
const MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000
const encode = encodeURIComponent
const decode = val => {
  return decodeURIComponent((val + '').replace(/\+/g, ' '))
}
const isNotEmptyString = val => {
  return typeof val === 'string' && val !== ''
}

/**
 * 获取 cookie 值
 * @return {string} 如果 name 不存在，返回 undefined
 */
export const get = name => {
  let ret, match

  if (isNotEmptyString(name)) {
    match = String(document.cookie).match(
        new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)'))
    if (match) {
      ret = match[1] ? decode(match[1]) : ''
    }
  }
  return ret
}

/**
 * 
 * @param {*} name 
 * @param {*} val 
 * @param {*} domain 
 * @param {Number/Date} expires 
 * @param {*} path 
 * @param {*} secure 
 */
export const set = (name, val, domain, expires, path, secure) => {
  let text = String(encode(val))
  let date = expires

  // 从当前时间开始，多少天后过期
  if (typeof date === 'number') {
    date = new Date()
    date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY)
  }

  // expiration date
  if (date instanceof Date) {
    text += '; expires=' + date.toUTCString()
  }

  // domain
  if (isNotEmptyString(domain)) {
    text += '; domain=' + domain
  }

  // path
  if (isNotEmptyString(path)) {
    text += '; path=' + path
  }

  // secure
  if (secure) {
    text += '; secure'
  }

  document.cookie = name + '=' + text
}

export const remove = (name, domain, path, secure) => {
  // 置空，并立刻过期
  set(name, '', domain, -1, path, secure)
}
