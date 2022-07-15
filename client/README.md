# react-spa-boilerplate

## 目录规范

```
config
  webpack.config.${env}.js
  postcss.config.js
data
src
  components: UI组件/公用业务组件
  decorators: HOC
  constants: 常量定义
  utils: 工具函数
  containers: 容器组件
    components: 业务组件
    constants: 常量定义
    actions: actions定义
    store: store配置
```

## polyfill

* babel-polyfill
