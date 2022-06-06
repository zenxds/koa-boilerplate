const Router = require('@koa/router')
const router = new Router()

router.post('/', async(ctx) => {
  // ctx.request.body
  // ctx.request.files
  ctx.body = JSON.stringify(ctx.request.body)
})

module.exports = router
