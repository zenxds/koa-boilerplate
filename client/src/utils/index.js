import { getPublicPath } from './getPublicPath'
import verifyCaptcha from './verifyCaptcha'

export function isMobileDevice() {
  return /iPhone|iPad|iPod|Android|mobile/i.test(navigator.userAgent) || screen.width < 640
}

export function getHashPath(href = window.location.href) {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1).split('?')[0]
}

export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

export * from './lang'
export * from './getPopupContainer'

export {
  getPublicPath,
  verifyCaptcha
}
