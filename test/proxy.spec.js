'use strict'

const inspect = require('util').inspect
const assert = require('assert')
const Stream = require('../')

describe('objectstream.proxy()', () => {

  it('should forward all events to `this` stream', (done) => {

    const stream1 = new Stream()
    const stream2 = new Stream()
    const stream3 = new Stream()

    let count = 1

    assert.equal(stream1.proxy(stream2, stream3) instanceof Stream, true)

    stream1._events.on('data', (data) => {
      assert.equal(data, `the data ${count++}`)

      if (count === 4) done()
    })

    stream1._events.emit('data', 'the data 1')
    stream2._events.emit('data', 'the data 2')
    stream3._events.emit('data', 'the data 3')
  })

  it('should only dispose own subscriptions', (done) => {

    const stream1 = new Stream()
    const stream2 = new Stream()
    const stream3 = new Stream()

    let count = 1

    stream1
      ._events.on('data', (data) => {
        assert.ok(!'this should not be triggered')
      })

    stream1.proxy(stream2, stream3)
      .dispose()

    stream2
      ._events.on('data', (data) => {
        assert.equal(data, 'the data 2')
        done()
      })

    stream1._events.emit('data', 'the data 1')
    stream2._events.emit('data', 'the data 2')
    stream3._events.emit('data', 'the data 3')
  })
})
