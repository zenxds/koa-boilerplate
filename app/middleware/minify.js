/**
 * http://koajs.com/
 */
const minify = require('html-minifier').minify

module.exports = function (options) {
  return async function (ctx, next) {
    await next()

    if (!ctx.response.is('html')) {
      return
    }

    let body = ctx.body
    if (!body || body.pipe) {
      return
    }

    if (Buffer.isBuffer(body)) {
      body = body.toString()
    }

    // 压缩可能出错
    try {
      ctx.body = minify(
        body,
        Object.assign(
          {
            collapseWhitespace: true,
          },
          options,
        ),
      )
    } catch (err) {}
  }
}
