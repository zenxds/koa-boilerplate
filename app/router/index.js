const Router = require('@koa/router')
const router = new Router()
// const uploadRouter = require('./upload')

const home = require('../controller/home')

router.get('/', home.index)
// router.use('/upload', uploadRouter.routes())

module.exports = router
