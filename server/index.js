// const cluster = require('cluster')
// const numCPUs = require('os').cpus().length

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`)

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork()
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`)
//   })
// } else {
//   require('./app')
//   console.log(`Worker ${process.pid} started`)
// }

const path = require('path')
const alias = {
  '@app': path.join(__dirname, 'app/app'),
  '@controller': path.join(__dirname, 'app/controller'),
  '@model': path.join(__dirname, 'app/model'),
  '@service': path.join(__dirname, 'app/service'),
  '@middleware': path.join(__dirname, 'app/middleware'),
  '@constant': path.join(__dirname, 'app/constant'),
  '@util': path.join(__dirname, 'app/util'),
}
const aliasKeys = Object.keys(alias)

const BuiltinModule = require('module')
const originalResolveFilename = BuiltinModule._resolveFilename

BuiltinModule._resolveFilename = function (request, parent, isMain, options) {
  for (let i = 0; i < aliasKeys.length; i++) {
    const key = aliasKeys[i]
    if (request.startsWith(key)) {
      request = request.replace(key, alias[key])
      break
    }
  }

  return originalResolveFilename.call(this, request, parent, isMain, options)
}

/**
 * use pm2 to cluster
 */
require('./app')
