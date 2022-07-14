const config = require('config')
const { DataTypes, Model } = require('sequelize')
const { each, camelCase } = require('../util')
const walk = require('../util/walk')
const sequelize = require('../service/sequelize')

const models = {}
const files = walk(__dirname)

each(files, (file, key) => {
  models[camelCase(key, true)] = file(sequelize, Model, DataTypes)
})

each(models, model => {
  if (model.associate) {
    model.associate(models)
  }
})

const { User, AuthToken } = models
User.addHook('afterCreate', 'generateAuthToken', (user) => {
  AuthToken.create({
    token: AuthToken.generate(),
    userId: user.id
  })
})

const adminUser = config.get('adminUser')

async function init() {
  await sequelize.sync()

  if (adminUser.username) {
    User.findOrCreate({
      where: {
        username: adminUser.username,
        isSuperuser: true
      },
      defaults: {
        password: adminUser.password,
      }
    })
  }
}

init()

module.exports = models
