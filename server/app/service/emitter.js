const EventEmitter = require('events')

/*
 * on/once/emit
 * emitter.emit('event', data)
 * emitter.on('event', function(data) {})
 */
module.exports = new EventEmitter()

// if (isProduction) {
//   module.exports = {
//     emit: (eventName, ...args) => {
//       process.send({
//         topic: eventName,
//         data: args
//       })
//     },

//     on: (eventName, listener) => {
//       process.on('message', function(packet) {
//         if (packet.topic === eventName) {
//           listener(...packet.data)
//         }
//       })
//     }
//   }
// }
