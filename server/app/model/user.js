const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
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

    async hasRole(name) {
      const roles = await this.getRoles()

      return roles.some(role => role.name === name)
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
          // is: /^[\w-]{4,20}$/
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
      isSuperAdmin: {
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
      modelName: 'User',
      tableName: 'user',
      setterMethods: {
        password(value) {
          if (/^[\w-]{4,20}$/.test(value)) {
            this.setDataValue('password', this.generateHash(value))
          } else {
            throw new Error('incorrect password format')
          }
        }
      }
    },
  )

  User.admin = {}

  return User
}
