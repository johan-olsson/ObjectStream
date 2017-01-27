'use strict'

const EventEmitter = require('events')

module.exports = class Stream extends EventEmitter {

  constructor() {
    super()
    this._subscriptions = []
  }

  write(data) {
    this.emit('data', data)
    return this
  }

  error(err) {
    this.emit('uncaughtException', err)
    return this
  }

  read(callback) {
    this.on('data', (data) => {
      callback(data)
    })
    return this
  }

  map(transform) {
    const stream = new Stream()

    this.on('data', (data) => {
      stream.write(transform(data))
    })

    return stream
  }

  pipe(stream) {
    this.on('data', (data) => {
      stream.write(data)
    })
    return stream
  }

  merge(...streams) {

    const outstream = new Stream()
    streams.push(this)

    streams.forEach((stream) => {
      stream.on('data', (data) => {
        outstream.emit('data', data)
      })
    })

    return outstream
  }

  proxy(...streams) {

    const handler = function (eventName, data) {
      this.emit(eventName, data)
    }

    streams.forEach((stream) => {

      const dataHandler = handler.bind(this, 'data')
      const uncaughtExceptionHandler = handler.bind(this, 'uncaughtException')

      stream.on('data', dataHandler)
      stream.on('uncaughtException', uncaughtExceptionHandler)

      this._subscriptions.push({
        stream: stream,
        event: 'data',
        handler: dataHandler
      }, {
        stream: stream,
        event: 'uncaughtException',
        handler: uncaughtExceptionHandler
      })
    })


    return this
  }

  catch(callback) {
    this.on('uncaughtException', (err) => {
      callback(err)
    })

    return this
  }

  dispose() {
    this.removeAllListeners('data')
    this.removeAllListeners('uncaughtException')

    while (this._subscriptions.length) {
      let { stream, event, handler } = this._subscriptions.shift()
      stream.removeListener(event, handler)
    }
  }
}
