const config = require('config')
const { User, Role } = require('../app/model')

const adminUser = config.get('adminUser')
const initRoles = ['user', 'admin']
const roleMap = {}

async function init() {
  for (let i = 0; i < initRoles.length; i++) {
    const [role, created] = await Role.findOrCreate({
      where: {
        name: initRoles[i],
      },
    })

    roleMap[initRoles[i]] = role
  }

  if (adminUser.username) {
    const [user, created] = await User.findOrCreate({
      where: {
        username: adminUser.username,
      },
      defaults: {
        isSuperAdmin: true,
        password: adminUser.password,
      },
    })
  }
}

init()
