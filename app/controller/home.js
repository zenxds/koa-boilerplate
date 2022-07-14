const services = require('../service')
const models = require('../model')

exports.index = async ctx => {
  const key = await services.redis.client.incr('key')

  const users = await models.User.findAll({
    include: ['tokens']
  })

  await ctx.render('index', {
    title: '首页',
    key: key,
  })
}
