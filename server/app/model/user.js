const crypto = require('crypto')
const { Model, DataTypes } = require('sequelize')

const sha1 = str => {
  const hash = crypto.createHash('sha1')
  hash.update(str)
  return hash.digest('hex')
}

module.exports = (sequelize) => {
  class User extends Model {
    static generateSalt() {
      return crypto.randomBytes(16).toString('hex')
    }

    static hashPassword(password, salt) {
      return sha1(password + salt)
    }

    static associate({ AuthToken, Role }) {
      User.hasMany(AuthToken)

      User.belongsToMany(Role, {
        through: 'user_role'
      })
    }

    validPassword(password) {
      return User.hashPassword(password, this.salt) === this.password
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
      salt: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'user',
      setterMethods: {
        password(value) {
          if (/^[\w-]{4,20}$/.test(value)) {
            let salt = this.getDataValue('salt')

            if (!salt) {
              salt = User.generateSalt()
              this.setDataValue('salt', salt)
            }

            this.setDataValue('password', User.hashPassword(value, salt))
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
