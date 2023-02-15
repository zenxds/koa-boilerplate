const { Op } = require('sequelize')
const { camelCase } = require('../util')
const models = require('../model')

exports.getModel = function(name = '') {
  return models[camelCase(name, true)]
}

// 分离attributes和associations参数
exports.separate = function(Model, data) {
  const attributes = {}
  const associations = {}
  const rawAttributes = Model.getAttributes()

  Object.keys(data).forEach(key => {
    if (Model.associations[key]) {
      associations[key] = {
        association: Model.associations[key],
        value: data[key],
      }
    } else if (Model.associations[camelCase(key, true)]) {
      associations[camelCase(key, true)] = {
        association: Model.associations[camelCase(key, true)],
        value: data[key],
      }
    } else if (rawAttributes[key]) {
      attributes[key] = data[key]
    }
  })

  return {
    attributes,
    associations,
  }
}

const getInclude = exports.getInclude = function(Model) {
  const include = []

  for (let i in Model.associations) {
    const association = Model.associations[i]

    include.push({
      model: association.target,
      as: association.as,
      required: false,
    })
  }

  return include
}

exports.getListQuery = function(Model, query) {
  const include = getInclude(Model)
  const order = []
  const where = {}
  const { orderField, orderDirection } = query

  if (orderField) {
    order.push([orderField, orderDirection || 'ASC'])
  }

  for (let item in query) {
    if (/^(page|pageSize|orderField|orderDirection)$/.test(item)) {
      continue
    }

    const association = Model.associations[item]
    if (association) {
      const includeItem = include.find(item => item.model === association.target)
      if (includeItem) {
        includeItem.where = {
          [association.target.primaryKeyAttribute]: query[item]
        }
      }
    } else {
      const attribute = Model.rawAttributes[item]
      if (attribute) {
        where[item] = attribute.references ? query[item] : {
          [Op.like]: `%${query[item]}%`,
        }
      }
    }
  }

  return {
    include,
    order,
    where
  }
}

exports.setAssociations = async function(instance, associations, { transaction }) {
  for (let i in associations) {
    const { value, association } = associations[i]

    if (/^(BelongsTo|HasOne)$/.test(association.associationType)) {
      const target = await association.target.findByPk(value)
      await instance[association.accessors.set](target, {
        transaction,
      })
    }

    if (/^(HasMany|BelongsToMany)$/.test(association.associationType)) {
      const targets = await association.target.findAll({
        where: {
          [association.target.primaryKeyAttribute]: Array.isArray(value)
            ? value
            : value.split(','),
        },
      })
      await instance[association.accessors.set](targets, {
        transaction,
      })
    }
  }
}
