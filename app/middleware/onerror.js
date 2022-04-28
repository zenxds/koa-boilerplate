const isJSON = require('koa-is-json')

/**
 * onerror handler
 */
module.exports = async function (ctx, next) {
  const isAPI = /\/api\//.test(ctx.path)

  try {
    await next()

    if (isJSON(ctx.body) && ctx.body.success !== undefined) {
      return
    }

    if (isAPI) {
      ctx.body = validateStatus(ctx.status)
        ? {
            success: true,
            data: ctx.body,
          }
        : {
            success: false,
            message: ctx.message,
          }
      return
    }
  } catch (err) {
    if (isAPI) {
      ctx.body = {
        success: false,
        message: err.message,
      }
      return
    }

    ctx.status = err.status || 500

    // throw 404
    if (ctx.status === 404) {
      await ctx.render('404', { message: err.message })
    } else {
      await ctx.render('500', { err })
      ctx.app.emit('error', err, ctx)
    }
  }

  // not found 404
  if (ctx.status === 404 && !ctx.body) {
    await ctx.render('404', { message: ctx.message })
  }
}

/**
 * from https://github.com/axios/axios
 */
function validateStatus(status) {
  return status >= 200 && status < 300
}
