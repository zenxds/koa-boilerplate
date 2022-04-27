const redis = require('../service/redis')

exports.index = async ctx => {
  const key = await redis.incr('key')

  if (ctx.query.error) {
    ctx.throw(500, 'error')
  }

  await ctx.render('index', {
    title: '首页',
    key: key,
  })
}
