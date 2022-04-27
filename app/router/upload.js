const path = require('path')
const uuid = require('uuid/v4')
const Router = require('@koa/router')
const router = new Router()

const multer = require('@koa/multer')

// 使用multer上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(path.dirname(__dirname), 'public')
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, uuid() + ext)
  },
})
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    if (ext === '.zip') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
})

// router.post('/post', upload.single('file'), async(ctx) => {
//   const {
//     body,
//     file
//   } = ctx.req
// })

module.exports = router
