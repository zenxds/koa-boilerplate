const bcrypt = require('bcrypt')

module.exports = (sequelize, Model, DataTypes) => {
  class User extends Model {
    static associate({ AuthToken, Role }) {
      User.hasMany(AuthToken, {
        as: 'tokens'
      })

      User.belongsToMany(Role, {
        through: 'user_role'
      })
    }

    generateHash(password) {
      const salt = bcrypt.genSaltSync()
      return bcrypt.hashSync(password, salt)
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password)
    }

    toJSON() {
      const values = Object.assign({}, this.get())

      delete values.password
      return values
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
        validate: {
          is: /^[a-zA-Z]\w{4,20}$/
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[\w-]{4,20}$/
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: {
          isEmail: true
        }
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
      modelName: 'user'
    },
  )

  User.addHook('beforeCreate', function(user) {
    user.password = user.generateHash(user.password)
  })

  return User
}
