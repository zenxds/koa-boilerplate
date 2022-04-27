const sequelize = require('../service/sequelize')

const User = sequelize.import('./user')

// alter: true
sequelize.sync()

module.exports = {
  User,
}
