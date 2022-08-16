const Router = require('@koa/router')
const router = new Router()
const logger = require('../util/logger')('error')

const Admin = require('koa-sequelize-admin')

module.exports = new Admin({
  router,
  logger,
  fields: {
    createdAt: {
      name: '创建时间'
    },
    updatedAt: {
      name: '更新时间'
    }
  }
})
