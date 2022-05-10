const services = require('../service')

exports.index = async ctx => {
  const key = await services.redis.client.incr('key')

  await ctx.render('index', {
    title: '首页',
    key: key,
  })
}
