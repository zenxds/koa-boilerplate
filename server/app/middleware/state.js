/**
 * ctx.state会被合并进模板引擎的locals
 * Object.assign(locals, options, ctx.state || {})
 */
const config = require('config')
const redisClient = require('@service/redis').client

let staticVersion = ''

module.exports = async function (ctx, next) {
  if (!staticVersion) {
    staticVersion = await redisClient.get('staticVersion')
  }

  ctx.state = {
    request: ctx.request,
    response: ctx.response,
    csrf: ctx.csrf,
    user: ctx.session.user,
    ip: ctx.get('X-Real-IP'),
    isProduction: ctx.isProduction,
    staticServer: config.staticServer,
    staticVersion,
    isMobile: /iPhone|iPad|iPod|Android/i.test(ctx.get('user-agent')),
  }

  await next()
}
