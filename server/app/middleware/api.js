const isJSON = require('koa-is-json')

/**
 * response handler
 */
module.exports = function (options={}) {
  options = Object.assign({
    match: ctx => /\/api\//.test(ctx.path)
  }, options)

  return async function (ctx, next) {
    const match = options.match(ctx)

    try {
      await next()

      if (!match || !isJSON(ctx.body)) {
        return
      }

      if (ctx.body.success !== undefined) {
        return
      }

      ctx.body = validateStatus(ctx.status)
        ? {
            success: true,
            data: ctx.body,
          }
        : {
            success: false,
            message: ctx.message,
          }
    } catch (err) {
      if (match) {
        ctx.body = {
          success: false,
          message: err.message,
        }
        ctx.app.emit('error', err, ctx)
      } else {
        throw err
      }
    }
  }
}

/**
 * from https://github.com/axios/axios
 */
function validateStatus(status) {
  return status >= 200 && status < 300
}
