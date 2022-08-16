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
    const page = parseInt(ctx.query.page || 1)
    const pageSize = parseInt(ctx.query.pageSize || 10)

    const list = await model.findAndCountAll(
      Object.assign(
        {
          offset: (page - 1) * pageSize,
          limit: pageSize,
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
        detail = await model.findByPk(pk)
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
