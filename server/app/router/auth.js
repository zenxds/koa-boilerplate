const Router = require('@koa/router')
const router = new Router()
const controller = require('@controller/auth')

router.get('/login', controller.render('登录'))
router.get('/register', controller.renderRegister)

router.post('/api/register', controller.register)
router.post('/api/login', controller.login)

router.get('/logout', controller.logout)

module.exports = router
