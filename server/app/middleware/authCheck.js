const { isIgnore } = require('@util')

module.exports = (options = {}) => {
  options = Object.assign(
    {
      enable: true,
      loginPath: '/user/login',
      ignore: ctx => /\/api\//.test(ctx.path) || /\/user\//.test(ctx.path),
    },
    options,
  )

  return async (ctx, next) => {
    const ignore = !options.enable || isIgnore(options.ignore, ctx)
    const loginUrl = `${options.loginPath}?backUrl=${encodeURIComponent(
      ctx.href,
    )}`

    if (ignore || ctx.session.user) {
      return await next()
    }

    return ctx.redirect(loginUrl)
  }
}
