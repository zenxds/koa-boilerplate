console.log(`BABEL_ENV: ${process.env.BABEL_ENV}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

module.exports = function(env) {
  console.log(`WEBPACK_ENV: ${env.env}`)
  return require(`./config/webpack.config.${env.env}.js`)
}
