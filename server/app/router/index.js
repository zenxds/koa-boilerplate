const Router = require('@koa/router')
const router = new Router()
const uploadRouter = require('./upload')

const controllers = require('../controller')

router.get('/', controllers.home.index)
router.use('/upload', uploadRouter.routes())

router.use('/user', require('./auth').routes())
router.use('/:model', require('./common').routes())

module.exports = router
