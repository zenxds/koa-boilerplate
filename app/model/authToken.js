// http://docs.sequelizejs.com/manual/tutorial/models-definition.html
// STRING TEXT INTEGER DATE DATEONLY BOOLEAN
// type, allowNull, defaultValue, unique, autoIncrement, primaryKey
const crypto = require('crypto')

module.exports = (sequelize, Model, DataTypes) => {
  class AuthToken extends Model {
    static associate({ User }) {
      AuthToken.belongsTo(User)
    }

    static generate() {
      return crypto.randomBytes(16).toString('hex')
    }
  }

  AuthToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'auth_token',
    },
  )

  return AuthToken
}
