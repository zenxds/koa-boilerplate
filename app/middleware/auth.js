const models = require('../model')
const { isIgnore } = require('../util')

module.exports = (options={}) => {
  options = Object.assign({
    enable: true,
    loginPath: '/user/login',
    ignore: ctx => /\/api\//.test(ctx.path) || /\/user\//.test(ctx.path)
  }, options)

  return async(ctx, next) => {
    if (!ctx.session) {
      throw new Error('session must enable for user login')
    }

    const ignore = !options.enable || isIgnore(options.ignore, ctx)
    const loginUrl = `${options.loginPath}?backUrl=${encodeURIComponent(ctx.href)}`
    const token = ctx.query.authToken || ctx.request.body.authToken || ctx.get('x-auth-token')

    // 有token先校验token
    if (token) {
      const record = await models.AuthToken.findOne({
        where: {
          token: token
        },
        include: [models.User]
      })

      if (record) {
        ctx.session.user = record.user
        return await next()
      }
    }

    if (ctx.session.user || ignore) {
      return await next()
    }

    return ctx.redirect(loginUrl)
  }
}
