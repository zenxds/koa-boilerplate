const config = require('config')
const Redis = require('ioredis')

const redisConfig = config.get('redis')

function factory(options = {}) {
  return new Redis(
    Object.assign(
      {
        host: redisConfig.host,
        port: redisConfig.port,
        db: redisConfig.db,
      },
      options,
    ),
  )
}

module.exports = {
  factory,

  client: factory()
}
