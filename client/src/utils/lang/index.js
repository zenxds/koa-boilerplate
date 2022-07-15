/**
 * 语言相关函数
 */

export const startsWith = (str, prefix) => {
  return str.lastIndexOf(prefix, 0) === 0
}

/**
 * array to map by a key attribute
 */
export function keyBy(array, key) {
  return array.reduce(function (map, obj) {
    let k = typeof key === 'function' ? key(obj) : obj[key]
    map[k] = obj
    return map
  }, {})
}

// 从对象中取出一系列属性
// pick(['pageNo', 'pageSize'], this.state)
export function pick(names, obj) {
  const ret = {}

  for (let i = 0; i < names.length; i++) {
    let name = names[i]

    if (name in obj) {
      ret[name] = obj[name]
    }
  }

  return ret
}

/**
 * 移除对象的falsey value
 * url参数提交时一般会用到 0，所以加上一个exclude参数
 */
export function compact(object, exclude = [0]) {
  const ret = {}

  Object.keys(object).forEach(key => {
    const value = object[key]

    if (!value && exclude.indexOf(value) === -1) {
      return
    }

    ret[key] = value
  })

  return ret
}

export * from './isPlainObject'
export * from './param'
