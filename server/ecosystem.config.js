module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'koa-app',
      script: 'index.js',
      instances : 'max',
      exec_mode : 'cluster',
      instance_var: 'INSTANCE_ID',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
