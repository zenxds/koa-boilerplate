const services = require('../service')
const models = require('../model')

exports.index = async ctx => {
  await ctx.render('index', {
    title: '首页',
  })
}

exports.getUserInfo = async ctx => {
  if (ctx.session.user) {
    ctx.body = {
      success: true,
      data: ctx.session.user
    }
  } else {
    ctx.body = {
      success: false,
      message: 'No User Info',
      data: null
    }
  }
}
