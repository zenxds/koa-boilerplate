const fs = require('fs')
const path = require('path')

const configFile = path.join(__dirname, '../config/production.js')

if (fs.existsSync(configFile)) {
  const config = require(configFile)
  const version = config.staticVersion.split('.')
  version[version.length - 1]++

  config.staticVersion = version.join('.')
  fs.writeFileSync(configFile, 'module.exports = ' + JSON.stringify(config, null, 2))
}
