'use strict'

const EventEmitter = require('events')

module.exports = class Stream {

  constructor(events) {
    this._events = events || new EventEmitter()
    this._subscriptions = []

    this._events.once('end', () => {
      this._events.removeAllListeners('data')
      this._events.removeAllListeners('error')

      while (this._subscriptions.length) {
        let { stream, event, handler } = this._subscriptions.shift()
        stream._events.removeListener(event, handler)
      }
    })
  }

  write(data) {
    this._events.emit('data', data)
    return this
  }

  error(err) {
    this._events.emit('error', err)
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

    this._events.on('error', (data) => {
      stream.error(data)
    })

    this._events.on('end', () => {
      stream.dispose()
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

    this._events.on('error', (data) => {
      stream.error(data)
    })

    this._events.on('end', () => {
      stream.dispose()
    })

    return stream
  }

  pipe(stream) {
    this._events.on('data', (data) => {
      stream.write(data)
    })
    this._events.on('error', (data) => {
      stream.error(data)
    })
    this._events.on('end', () => {
      stream.dispose()
    })
    return stream
  }

  merge(...streams) {

    const outstream = new Stream()

    streams.push(this)
    streams.forEach((stream) => {
      stream._events.on('data', (data) => {
        outstream.write(data)
      })
      stream._events.on('error', (data) => {
        outstream.error(data)
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
      const errorHandler = handler.bind(this, 'error')

      stream._events.on('data', dataHandler)
      stream._events.on('error', errorHandler)

      this._subscriptions.push({
        stream: stream,
        event: 'data',
        handler: dataHandler
      }, {
        stream: stream,
        event: 'error',
        handler: errorHandler
      })
    })

    return this
  }

  catch(callback) {
    this._events.on('error', (err) => {
      callback(err)
    })

    return this
  }

  dispose() {
    this._events.emit('end')
  }
}
