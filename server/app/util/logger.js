const log4js = require('log4js')

log4js.configure(require('../../config/log4js'))

module.exports = category => log4js.getLogger(category)
