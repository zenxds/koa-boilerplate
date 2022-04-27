const config = {
  appenders: {
    console: {
      type: 'console'
    },
    error: {
      type: 'fileSync',
      filename: 'log/error.log',
      category: 'error'
    },
    app: {
      type: 'fileSync',
      filename: 'log/app.log',
      category: 'app'
    }
  },

  categories: {
    default: { appenders: ['console'], level: 'debug' },
    error: { appenders: ['error'], level: 'error' },
    app: { appenders: ['app'], level: 'info' }
  }
}

if (/production/.test(process.env.NODE_ENV)) {
  config.pm2 = true
  config.pm2InstanceVar = 'INSTANCE_ID'
  // config.disableClustering = true
}

module.exports = config
