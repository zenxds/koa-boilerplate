const Router = require('@koa/router')
const router = new Router()
const controller = require('../controller/common')

router.post('/api/create', controller.create)
router.post('/api/update', controller.update)
router.get('/api/list', controller.list)
router.get('/api/listAll', controller.listAll)
router.get('/api/get', controller.get)
router.post('/api/del', controller.del)

module.exports = router
