const EventEmitter = require('events')
const { isProduction } = require('../app')

/*
 * on/once/emit
 */
if (isProduction) {
  module.exports = {
    emit: (eventName, ...args) => {
      process.send({
        topic: eventName,
        data: args,
      })
    },

    on: (eventName, listener) => {
      process.on('message', function (packet) {
        if (packet.topic === eventName) {
          listener(...packet.data)
        }
      })
    },

    once: (eventName, listener) => {
      const handler = function (packet) {
        if (packet.topic === eventName) {
          process.off('message', handler)
          listener(...packet.data)
        }
      }

      process.on('message', handler)
    },
  }
} else {
  module.exports = new EventEmitter()
}
