const services = require('../service')
const models = require('../model')

exports.renderLogin = async ctx => {
  await ctx.render('login')
}

exports.login = async ctx => {
  const { body } = ctx.request
  const { username, password } = body

  if (!username || !password) {
    return ctx.throw(403)
  }

  const user = await models.User.findOne({
    where: {
      username
    }
  })

  if (!user) {
    await ctx.render('login', {
      error: '用户不存在'
    })
    return
  }

  const backUrl = ctx.query.backUrl || '/'
  if (user.validPassword(password)) {
    ctx.session.user = user
    ctx.redirect(backUrl)
  } else {
    await ctx.render('login', {
      error: '密码不正确'
    })
  }
}

exports.logout = async ctx => {
  const backUrl = ctx.query.backUrl || ''

  ctx.session.user = null
  ctx.redirect('/user/login?backUrl=' + backUrl)
}
