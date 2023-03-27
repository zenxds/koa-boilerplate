const Router = require('@koa/router')
const router = new Router()

const controllers = require('@controller')
const adminService = require('@service/admin')
const uploadRouter = require('./upload')

router.get('/', controllers.home.index)
router.get('/api/getUserInfo', controllers.home.getUserInfo)

router.use('/upload', uploadRouter.routes())

router.use('/user', require('./auth').routes())
router.use('/api/:model', require('./common').routes())

router.get('/admin/', async (ctx) => {
  await ctx.render('admin', {})
})
router.use('/admin', adminService.router.routes())

module.exports = router
