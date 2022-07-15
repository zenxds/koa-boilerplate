const models = require('../model')
const { errorCodeMap } = require('../constant')

const { User } = models

exports.render = title => {
  return async ctx => {
    await ctx.render('index', {
      title
    })
  }
}

exports.login = async ctx => {
  const { body } = ctx.request
  const { username, password } = body

  if (!username || !password) {
    throw new Error(`${errorCodeMap.emptyValue}: 用户名或密码不能为空`)
  }

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (!user) {
    throw new Error(`${errorCodeMap.userNotExist}: 用户不存在`)
  }

  if (!user.validPassword(password)) {
    throw new Error(`${errorCodeMap.passwordIncorrect}: 密码不正确`)
  }

  ctx.session.user = user
  ctx.body = user
}

exports.register = async ctx => {
  const { body } = ctx.request
  const { username, password } = body

  if (!username || !password) {
    throw new Error(`${errorCodeMap.emptyValue}: 用户名或密码不能为空`)
  }

  let user = await User.findOne({
    where: {
      username
    }
  })

  if (user) {
    throw new Error(`${errorCodeMap.userExist}: 该用户名已被注册`)
  }

  user = await User.create({
    username,
    password
  })

  ctx.session.user = user
  ctx.body = user
}

exports.logout = async ctx => {
  const backUrl = ctx.query.backUrl || ''

  ctx.session.user = null
  ctx.redirect('/user/login?backUrl=' + backUrl)
}
