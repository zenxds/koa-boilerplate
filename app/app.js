const config = require('config')
const Koa = require('koa')

const getLogger = require('./util/logger')
const appLogger = getLogger('app')
const errorLogger = getLogger('error')
const app = new Koa({
  keys: config.get('keys'),
})
const isProduction = /production/.test(app.env)

Object.assign(app, {
  isProduction,
})

Object.assign(app.context, {
  isProduction,
  appLogger,
  errorLogger,
})

app.on('error', (err, ctx) => {
  if (isProduction) {
    errorLogger.error(`${ctx.path}: ${err.message}`)
  } else {
    console.log(`${ctx.path}`)
    console.log(err)
  }
})

module.exports = app
