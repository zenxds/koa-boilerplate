const EventEmitter = require('events')

/*
 * on/once/emit
 * emitter.emit('event', data)
 * emitter.on('event', function(data) {})
 */
module.exports = new EventEmitter()
