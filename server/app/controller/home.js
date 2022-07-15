const services = require('../service')
const models = require('../model')

exports.index = async ctx => {
  // const key = await services.redis.client.incr('key')
  const user = ctx.session.user

  ctx.body = user
}
