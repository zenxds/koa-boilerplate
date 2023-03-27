const Router = require('@koa/router')
const router = new Router()
const controller = require('@controller/common')

router.post('/create', controller.create)
router.post('/update', controller.update)
router.get('/list', controller.list)
router.get('/listAll', controller.listAll)
router.get('/get', controller.get)
router.post('/del', controller.del)

module.exports = router
