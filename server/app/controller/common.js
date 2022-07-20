const { camelCase } = require('../util')
const models = require('../model')

function getModel(name = '') {
  return models[camelCase(name, true)]
}

// 分离attributes和associations参数
function separate(Model, data) {
  const attributes = {}
  const associations = {}
  const rawAttributes = Model.rawAttributes

  Object.keys(data).forEach(key => {
    if (rawAttributes[key]) {
      attributes[key] = data[key]
    } else if (Model.associations[key]) {
      associations[key] = {
        association: Model.associations[key],
        value: data[key]
      }
    } else if (Model.associations[camelCase(key, true)]) {
      associations[camelCase(key, true)] = {
        association: Model.associations[camelCase(key, true)],
        value: data[key]
      }
    }
  })

  return {
    attributes,
    associations
  }
}

async function setAssociations(instance, associations) {
  for (let i in associations) {
    const { value, association} = associations[i]

    if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
      const target = await association.target.findByPk(value)
      await instance[association.accessors.set](target)
    }

    if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
      const targets = await association.target.findAll({
        where: {
          [association.target.primaryKeyAttribute]: Array.isArray(value) ? value : value.split(',')
        }
      })
      await instance[association.accessors.set](targets)
    }
  }
}

exports.create = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  const { body } = ctx.request
  const { attributes, associations } = separate(Model, body)

  const instance = await Model.create(attributes)
  await setAssociations(instance, associations)

  ctx.body = instance
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

  await instance.update(attributes)
  await setAssociations(instance, associations)

  ctx.body = instance
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

  ctx.body = await Model.findAndCountAll({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    include: { all: true }
  })
}

exports.listAll = async ctx => {
  const Model = getModel(ctx.params.model)

  if (!Model) {
    return ctx.throw(400)
  }

  ctx.body = await Model.findAll({
    include: { all: true }
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
