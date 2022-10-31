const os = require('os')
const path = require('path')
const fse = require('fs-extra')
const config = require('config')
const session = require('koa-session')
// const CSRF = require('koa-csrf')
const koaStatic = require('koa-static')
// const xmlParser = require('koa-xml-body')
const json = require('koa-json')
const uuid = require('uuid').v4

const app = require('./app')
const router = require('./router')

const publicDir = path.join(__dirname, 'public')
const uploadDir = os.tmpdir()

app.use(require('./middleware/logger')(app))
app.use(require('./middleware/minify')())
// app.use(
//   xmlParser({
//     key: 'xmlBody',
//     xmlOptions: {
//       explicitArray: false,
//     },
//   }),
// )
// 放在csrf之前
app.use(
  require('koa-body')({
    text: false,
    formLimit: '10mb',
    multipart: true,
    formidable: {
      uploadDir,
      keepExtensions: true,
      // 1G
      maxFileSize: 1024 * 1024 * 1024,
      filename: (name, ext) => {
        const dir = uuid().split('-')[0]

        fse.ensureDirSync(path.join(uploadDir, dir))
        return path.join(dir, name + ext)
      },
      filter: function ({ name, originalFilename, mimetype }) {
        const ext = path.extname(originalFilename)

        // svg有安全问题
        if (ext === '.svg') {
          return false
        }

        if (mimetype) {
          if (/^(image|video|text)/.test(mimetype)) {
            return true
          }
        }

        if (ext === '.pdf') {
          return true
        }

        return false
      }
    }
  })
)
app.use(
  session(
    {
      store: require('./service/sessionStore'),
    },
    app,
  ),
)
// app.use(new CSRF())
app.use(require('./middleware/cors'))
app.use(
  koaStatic(publicDir, {
    hidden: true,
    maxage: app.isProduction ? 1000 * 3600 * 24 : 0,
  }),
)
app.use(require('./middleware/render'))
app.use(require('./middleware/error'))
app.use(json())
app.use(require('./middleware/api')())
app.use(require('./middleware/auth')())
// 先经过auth才能拿到user
app.use(require('./middleware/state'))
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.get('port'), function () {
  console.log(`server is running on port ${this.address().port}`)
})

module.exports = app
