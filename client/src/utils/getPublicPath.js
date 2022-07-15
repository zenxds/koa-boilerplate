export function dirname(p) {
  return p
    .split('/')
    .slice(0, -1)
    .join('/')
}

export function getPublicPath() {
  const currentScript = getCurrentScript()

  if (!currentScript || !currentScript.src) {
    return ''
  }

  return dirname(currentScript.src) + '/'
}

function getCurrentScript() {
  if (document.currentScript) {
    return document.currentScript
  }

  // For IE6-9 browsers, the script onload event may not fire right
  // after the script is evaluated. Kris Zyp found that it
  // could query the script nodes and the one that is in "interactive"
  // mode indicates the current script
  // ref: http://goo.gl/JHfFW

  // 开放id获取当前js
  const scripts = document.getElementsByTagName('script')

  for (let i = scripts.length - 1; i >= 0; i--) {
    const script = scripts[i]
    if (script.readyState === 'interactive') {
      return script
    }
  }

  // 兜底的情况，获取最后一个 script 节点
  return scripts[scripts.length - 1]
}
