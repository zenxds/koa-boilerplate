const {
  separate,
  getModel,
  getListQuery,
  setAssociations,
} = require('@service/common')

exports.create = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  const { body } = ctx.request
  const { attributes, associations } = separate(Model, body)

  const t = await Model.sequelize.transaction()
  try {
    const instance = await Model.create(attributes, {
      transaction: t,
    })
    await setAssociations(instance, associations, { transaction: t })
    await t.commit()

    ctx.body = instance
  } catch (err) {
    await t.rollback()
    throw err
  }
}

exports.update = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  const { body } = ctx.request
  const instance = await Model.findByPk(body.id)

  if (!instance) {
    return ctx.throw(400)
  }

  const { attributes, associations } = separate(Model, body)
  delete attributes.id

  const t = await Model.sequelize.transaction()
  try {
    await instance.update(attributes, {
      transaction: t,
    })
    await setAssociations(instance, associations, {
      transaction: t,
    })
    await t.commit()

    ctx.body = instance
  } catch (err) {
    await t.rollback()
    throw err
  }
}

exports.del = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  const { body } = ctx.request
  const instance = await Model.findByPk(body.id)

  if (!instance) {
    return ctx.throw(400)
  }

  await instance.destroy()
  ctx.body = true
}

exports.list = async ctx => {
  const Model = getModel(ctx.params.model)
  const page = parseInt(ctx.query.page || 1)
  const pageSize = parseInt(ctx.query.pageSize || 10)

  if (!Model) {
    return ctx.throw(400)
  }

  const { include, where, order } = getListQuery(Model, ctx.query)
  ctx.body = await Model.findAndCountAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    distinct: true,
    include,
    where,
    order,
  })
}

exports.listAll = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  const { include, where, order } = getListQuery(Model, ctx.query)
  ctx.body = await Model.findAll({
    include,
    where,
    order,
  })
}

exports.get = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  const instance = await Model.findByPk(ctx.query.id)

  if (!instance) {
    return ctx.throw(400)
  }

  ctx.body = instance
}
