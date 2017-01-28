'use strict'

const EventEmitter = require('events')

module.exports = class Stream {

  constructor(events) {
    this._events = events || new EventEmitter()
    this._subscriptions = []
  }

  write(data) {
    this._events.emit('data', data)
    return this
  }

  error(err) {
    this._events.emit('uncaughtException', err)
    return this
  }

  read(callback) {
    this._events.on('data', (data) => {
      callback(data)
    })
    return this
  }

  map(transform) {
    const stream = new Stream()

    this._events.on('data', (data) => {
      const result = transform(data, (data) => {
        stream.write(data)
      })

      if (result) stream.write(result)
    })

    return stream
  }

  filter(filter) {
    const stream = new Stream()

    this._events.on('data', (data) => {
      const result = filter(data, (result) => {
        if (result) stream.write(data)
      })

      if (result) stream.write(data)
    })

    return stream
  }

  pipe(stream) {
    this._events.on('data', (data) => {
      stream.write(data)
    })
    return stream
  }

  merge(...streams) {

    const outstream = new Stream()

    streams.push(this)
    streams.forEach((stream) => {
      stream._events.on('data', (data) => {
        outstream._events.emit('data', data)
      })
    })

    return outstream
  }

  proxy(...streams) {

    const handler = function (eventName, data) {
      this._events.emit(eventName, data)
    }

    streams.forEach((stream) => {

      const dataHandler = handler.bind(this, 'data')
      const uncaughtExceptionHandler = handler.bind(this, 'uncaughtException')

      stream._events.on('data', dataHandler)
      stream._events.on('uncaughtException', uncaughtExceptionHandler)

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
    this._events.on('uncaughtException', (err) => {
      callback(err)
    })

    return this
  }

  dispose() {
    this._events.removeAllListeners('data')
    this._events.removeAllListeners('uncaughtException')

    while (this._subscriptions.length) {
      let { stream, event, handler } = this._subscriptions.shift()
      stream._events.removeListener(event, handler)
    }
  }
}
