const services = require('../service')
const models = require('../model')

exports.index = async ctx => {
  // const key = await services.redis.client.incr('key')

  ctx.body = ctx.session.user
}
