const config = require('config')
const Koa = require('koa')

const getLogger = require('./util/logger')
const appLogger = getLogger('app')
const errorLogger = getLogger('error')
const app = new Koa({
  keys: config.get('keys'),
})
const isProduction = /production/.test(app.env)
const isMaster = isProduction ? process.env.INSTANCE_ID === '0' : true

Object.assign(app, {
  isProduction,
  isMaster
})

Object.assign(app.context, {
  isProduction,
  isMaster,
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
