const { Sequelize } = require('sequelize')
const dbConfig = require('config').get('db')

const sequelize = new Sequelize(Object.assign({
  define: {
    // underscored: true
    // freezeTableName: true
  }
}, dbConfig))

sequelize
  .authenticate()
  .then(function () {
    console.log('DB Connection has been established successfully')
  })
  .catch(function (err) {
    console.log('Unable to connect to DB: ', err)
  })

module.exports = sequelize
