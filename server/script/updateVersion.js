const config = require('config')
const Redis = require('ioredis')

;(async function() {
  const redis = new Redis(config.get('redis'))

  let val = await redis.get('staticVersion')
  if (!val) {
    val = '0.1.0'
  }

  const version = val.split('.')
  version[version.length - 1]++

  await redis.set('staticVersion', version.join('.'))
  process.exit(0)
})()
