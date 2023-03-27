const fs = require('fs')
const path = require('path')
const Router = require('@koa/router')
const router = new Router()

const { getUploadMimeType } = require('@util')
const publicDir = path.join(__dirname, '../public')

router.post('/', async(ctx) => {
  // ctx.request.body
  // ctx.request.files
  ctx.body = JSON.stringify(ctx.request.body)

  const { file } = ctx.request.files
  // const ext = path.extname(file.originalFilename)
  const mimetype = getUploadMimeType(file)

  if (!/^(image)/.test(mimetype)) {
    fs.unlinkSync(file.filepath)
    return
  }

  // 校验通过后再将文件从临时目录拷贝到public目录
  fs.copyFileSync(file.filepath, path.join(publicDir, file.newFilename))
  fs.unlinkSync(file.filepath)

})

module.exports = router
