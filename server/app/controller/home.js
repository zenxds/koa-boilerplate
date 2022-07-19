const services = require('../service')
const models = require('../model')

exports.index = async ctx => {
  await ctx.render('index', {
    title: '首页',
  })
}
