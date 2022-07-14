const services = require('../service')
const models = require('../model')

exports.renderLogin = async ctx => {
  await ctx.render('login')
}

exports.login = async ctx => {
  // const key = await services.redis.client.incr('key')

  // await ctx.render('index', {
  //   title: '首页',
  //   key: key,
  // })
  ctx.body = 'login'
}

exports.logout = async ctx => {
  const backUrl = ctx.query.backUrl || ''

  ctx.session.user = null
  ctx.redirect('/user/login?backUrl=' + backUrl)
}
