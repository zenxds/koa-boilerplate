module.exports = {
  keys: ['58f9014fb686fe9b6449f1769e37ec90a676e9c6'],
  port: 7002,

  mail: {
    from: '',
    user: '',
    password: ''
  },

  db: {
    dialect: "mysql",
    host: "127.0.0.1",
    port: "3306",
    database: "",
    username: "",
    password: "",
    logging: console.log
  },

  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 0
    // password: null
  },

  ignoreOrigin: false,

  staticVersion: '0.1.0'
}
