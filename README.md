# koa-boilerplate

```
yarn i
npm start
```

## 文件说明

```
log/access.log  // 访问log
log/app.log     // 应用log
log/error.log   // 错误log

config/log4js   // 日志文件配置
config/nginx    // nginx部署配置
config/mysql    // mysql配置
其他为环境配置文件

app/controller
app/middleware
app/model
app/service
app/view
app/router
app/public
app/util
```

## 部署说明

目前推荐使用docker部署

首先安装docker和docker-compose，写好docker配置文件，运行`npm run deploy:docker`

## tips

bodyparser有提交长度限制，需要额外配置
