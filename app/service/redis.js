const config = require('config')
const Redis = require('ioredis')

const redis = new Redis(config.get('redis'))

module.exports = redis
