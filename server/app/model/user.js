// http://docs.sequelizejs.com/manual/tutorial/models-definition.html
// STRING TEXT INTEGER DATE DATEONLY BOOLEAN
// type, allowNull, defaultValue, unique, autoIncrement, primaryKey
const bcrypt = require('bcrypt')

module.exports = (sequelize, Model, DataTypes) => {
  class User extends Model {
    static associate({ AuthToken }) {
      User.hasMany(AuthToken, {
        as: 'tokens'
      })
    }

    generateHash(password) {
      const salt = bcrypt.genSaltSync()
      return bcrypt.hashSync(password, salt)
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password)
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      isSuperuser: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'user',
    },
  )

  User.addHook('beforeCreate', function(user) {
    user.password = user.generateHash(user.password)
  })

  return User
}
