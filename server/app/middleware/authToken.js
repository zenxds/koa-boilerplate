const models = require('../model')

module.exports = async (ctx, next) => {
  if (!ctx.session) {
    throw new Error('session must enable for user login')
  }

  // 考虑到中间件被多次调用的情况
  if (ctx.user) {
    return await next()
  }

  if (ctx.session.user) {
    defineUser(ctx)
    return await next()
  }

  const token =
    ctx.query.authToken || ctx.request.body.authToken || ctx.get('x-auth-token')

  // 有token先校验token
  if (token) {
    const record = await models.AuthToken.findOne({
      where: {
        token: token,
      },
      include: [
        {
          model: models.User,
          as: 'user',
        },
      ],
    })

    if (record) {
      ctx.session.user = record.user
      defineUser(ctx)
    }
  }

  await next()
}

function defineUser(ctx) {
  const user = ctx.session.user

  Object.defineProperties(ctx, {
    userId: {
      get: () => user.id,
    },

    user: {
      get: () => user,
    },
  })
}
