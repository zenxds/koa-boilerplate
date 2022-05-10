const config = require('config')
const Redis = require('ioredis')

function factory() {
  return new Redis(config.get('redis'))
}

module.exports = {
  factory,

  client: factory()
}
