
const fs = require('fs')
const path = require('path')

const isOnlyIndex = function(obj) {
  return Object.keys(obj).length === 1 && obj.index
}

/**
 * 递归把目录下的JS文件转成对象的嵌套
 */
const walk = function(dir, extensions = /\.(js|json)$/) {
  const ret = {}
  if (!fs.existsSync(dir)) {
    return ret
  }

  const files = fs.readdirSync(dir)

  for (let file of files) {
    const p = path.join(dir, file)
    const stat = fs.statSync(p)

    if (stat.isDirectory()) {
      const children = walk(p)
      ret[path.basename(p)] = isOnlyIndex(children) ? children.index : children
      continue
    }

    const ext = path.extname(p).toLowerCase()
    if (stat.isFile() && extensions.test(ext)) {
      ret[path.basename(p, ext)] = require(p)
    }
  }

  return ret
}

module.exports = walk
