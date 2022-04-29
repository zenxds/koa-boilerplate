const path = require('path')
const config = require('config')
const session = require('koa-session')
const CSRF = require('koa-csrf')
const koaStatic = require('koa-static')
const xmlParser = require('koa-xml-body')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const compress = require('koa-compress')

const app = require('./app')
const router = require('./router')

app.use(require('./middleware/logger')(app))
app.use(compress())
app.use(require('./middleware/minify')())
app.use(
  xmlParser({
    xmlOptions: {
      explicitArray: false,
    },
  }),
)
// 放在csrf之前
app.use(
  bodyParser({
    formLimit: '10mb',
  }),
)
app.use(
  session(
    {
      store: require('./service/sessionStore'),
    },
    app,
  ),
)
app.use(new CSRF())
app.use(require('./middleware/cors'))
app.use(
  koaStatic(path.join(__dirname, 'public'), {
    hidden: true,
    maxage: app.isProduction ? 1000 * 3600 * 24 : 0,
  }),
)
app.use(require('./middleware/render'))
app.use(require('./middleware/state'))
app.use(require('./middleware/error'))
app.use(json())
app.use(require('./middleware/api')())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(config.get('port'), function () {
  console.log(`server is running on port ${this.address().port}`)
})

module.exports = app
