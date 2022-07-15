/**
 * redis store for koa-session
 */
class RedisStore {
  constructor(options = {}) {
    this.client = options.client
  }

  async get(key) {
    const value = await this.client.get(key)
    return JSON.parse(value)
  }

  async set(key, value, maxAge) {
    await this.client.set(key, JSON.stringify(value), 'EX', maxAge / 1000)
  }

  async destroy(key) {
    await this.client.del(key)
  }
}

module.exports = new RedisStore({
  client: require('./redis').factory(),
})
