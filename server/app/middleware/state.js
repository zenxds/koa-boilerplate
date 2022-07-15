/**
 * ctx.state会被合并进模板引擎的locals
 * Object.assign(locals, options, ctx.state || {})
 */
const config = require('config')

module.exports = async function (ctx, next) {
  ctx.state = {
    request: ctx.request,
    response: ctx.response,
    csrf: ctx.csrf,
    user: ctx.user,
    isProduction: ctx.isProduction,

    staticVersion: config.staticVersion || '0.1.0',
    isMobile: /iPhone|iPad|iPod|Android/i.test(ctx.get('user-agent')),
  }

  await next()
}
