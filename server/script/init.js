const config = require('config')
const { User, Role } = require('../app/model')

const adminUsers = config.get('adminUsers')
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

  for (let i = 0; i < adminUsers.length; i++) {
    const { username, password } = adminUsers[i]
    const [user, created] = await User.findOrCreate({
      where: {
        username,
      },
      defaults: {
        isSuperAdmin: true,
        password,
      },
    })
  }
}

init().catch(err => {
  console.log(err)
})
