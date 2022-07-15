const Router = require('@koa/router')
const router = new Router()
const controller = require('../controller/auth')

router.get('/login', controller.render('登录'))
router.post('/api/login', controller.login)

router.get('/register', controller.render('注册'))
router.post('/api/register', controller.register)

router.get('/logout', controller.logout)

module.exports = router
