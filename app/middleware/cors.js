const config = require('config')

module.exports = require('@koa/cors')({
  credentials: true,
  keepHeadersOnError: true,
  maxAge: '86400',
  allowHeaders: 'Accept,Content-Type,X-Requested-With,csrf-token',
  origin: ctx => {
    const requestOrigin = ctx.get('Origin')
    if (!ctx.isProduction || config.get('ignoreOrigin')) {
      return requestOrigin
    }

    if (/dingxiang-inc\.com/.test(requestOrigin)) {
      return requestOrigin
    }
  },
})
