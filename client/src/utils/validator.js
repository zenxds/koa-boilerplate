export function isEmail(s) {
  return /^[\w-.]+@([\w-]+\.)+[a-z]{2,}$/i.test(s)
}

export function isMobile(s) {
  return /^\d{11}$/i.test(s)
}

export function isSMSCode(s) {
  return /^\d{6}$/i.test(s)
}

export function isPassword(s) {
  return /^[\w-]{4,20}$/.test(s)
}

export function isUsername(s) {
  return /^[a-zA-Z]\w{4,20}$/.test(s)
}
