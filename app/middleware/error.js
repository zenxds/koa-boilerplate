/**
 * error handler
 */
module.exports = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500

    if (ctx.status === 404) {
      await ctx.render('404', { message: err.message })
    } else {
      await ctx.render('500', { err })
      ctx.app.emit('error', err, ctx)
    }
    return
  }

  // normal 404
  if (ctx.status === 404) {
    await ctx.render('404')
  }
}
