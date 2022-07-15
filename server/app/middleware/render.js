const path = require('path')
const views = require('koa-views')
const dayjs = require('dayjs')
const nunjucks = require('nunjucks')

const viewPath = path.join(__dirname, '../view')

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(viewPath))

env.addFilter('dayjs', function (time, format) {
  return dayjs(time).format(format)
})

module.exports = views(viewPath, {
  map: {
    html: 'nunjucks',
  },
  extension: 'html',
  options: {
    nunjucksEnv: env,
  },
})
