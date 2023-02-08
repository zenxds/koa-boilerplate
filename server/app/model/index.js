const { each, camelCase } = require('../util')
const walk = require('../util/walk')
const sequelize = require('../service/sequelize')
const adminService = require('../service/admin')

const models = {}
const files = walk(__dirname)

each(files, (file, key) => {
  models[camelCase(key, true)] = file(sequelize)
})

each(models, model => {
  if (model.associate) {
    model.associate(models)
  }
})

each(models, model => {
  if (model.admin) {
    adminService.register(model, model.admin)
  }
})
adminService.setup()

const { User, AuthToken } = models
User.addHook('afterCreate', 'generateAuthToken', (user) => {
  AuthToken.create({
    token: AuthToken.generate(),
    userId: user.id
  })
})

const { isProduction } = require('../app')
if (isProduction) {
  sequelize.sync().catch(err => {
    console.log(err)
  })
} else {
  sequelize.sync({
    alter: true
  })
}

module.exports = models
