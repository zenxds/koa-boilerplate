const Router = require('@koa/router')
const router = new Router()
const controller = require('../controller/auth')

router.get('/login', controller.renderLogin)
router.post('/login', controller.login)
router.get('/logout', controller.logout)

module.exports = router
