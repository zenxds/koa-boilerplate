/**
 * 各种通用service
 */

/**
 * 渲染模板
 */
exports.view = (template = '', locals = {}) => {
  return async ctx => {
    await ctx.render(template, locals)
  }
}

/**
 * 列表渲染
 */
exports.listView = options => {
  const { model, modelOptions = {}, template = '', locals = {} } = options

  return async ctx => {
    const p = parseInt(ctx.query.p || 1)
    const n = parseInt(ctx.query.n || 10)

    const list = await model.findAndCountAll(
      Object.assign(
        {
          offset: (p - 1) * n,
          limit: n,
        },
        modelOptions,
      ),
    )

    if (template) {
      await ctx.render(
        template,
        Object.assign(
          {
            list,
          },
          locals,
        ),
      )
    } else {
      ctx.body = list
    }
  }
}

/**
 * 详情渲染
 */
exports.detailView = options => {
  const { model, modelOptions = {}, template = '', locals = {} } = options

  return async ctx => {
    const pk = ctx.query.pk || ctx.query.id

    let detail
    try {
      if (pk) {
        detail = await model.findById(pk)
      } else {
        detail = await model.findOne(modelOptions)
      }
    } catch (err) {
      return ctx.throw(404)
    }

    if (template) {
      await ctx.render(
        template,
        Object.assign(
          {
            detail,
          },
          locals,
        ),
      )
    } else {
      ctx.body = detail
    }
  }
}
