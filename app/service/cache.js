/**
 * 缓存
 */
const LRU = require('lru-cache')
const cache = new LRU({
  max: 500,
  ttl: 1000 * 60 * 10,
})

module.exports = cache
