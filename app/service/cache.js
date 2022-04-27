/**
 * 缓存
 */

const cache = require('lru-cache')({
  max: 100,
  maxAge: 1000 * 60 * 10,
})

module.exports = cache
