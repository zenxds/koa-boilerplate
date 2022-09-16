const cache = require('../service/cache')

const toString = Object.prototype.toString
const isType = (type) => {
  return function(obj) {
    return toString.call(obj) == '[object ' + type + ']'
  }
}
const isFunction = isType('Function')
const isRegExp = isType('RegExp')

exports.each = (object, fn) => {
  let length = object.length

  if (length === +length) {
    for (let i = 0; i < length; i++) {
      if (fn(object[i], i, object) === false) {
        break
      }
    }
  } else {
    for (let i in object) {
      if ((fn(object[i], i, object) === false)) {
        break
      }
    }
  }
}

exports.camelCase = (str, isBig) => {
  const ret = str
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[-_][^-_]/g, function(match) {
      return match.charAt(1).toUpperCase()
    })

  return (
    (isBig ? ret.charAt(0).toUpperCase() : ret.charAt(0).toLowerCase()) +
    ret.slice(1)
  )
}

exports.isIgnore = (ignore, ctx) => {
  if (isRegExp(ignore)) {
    return ignore.test(ctx.path)
  }

  if (isFunction(ignore)) {
    return ignore(ctx)
  }

  return !!ignore
}

exports.cacheDecorator = (key, fn) => {
  return async () => {
    let data = cache.get(key)
    if (data) {
      return data
    }

    data = await fn()
    cache.set(key, data)
    return data
  }
}
