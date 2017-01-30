'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.merge()', () => {

  it('should forward errors', (done) => {

    const stream1 = new Stream()
    const stream2 = new Stream()
    const stream3 = new Stream()
    const outstream = stream1.merge(stream2, stream3)

    outstream.catch((err) => {
      assert.equal(err, 'the error')
      done()
    })

    assert.equal(outstream instanceof Stream, true)
    stream3._events.emit('error', 'the error')
  })

  it('should return new stream listening to all merged once', (done) => {

    const stream1 = new Stream()
    const stream2 = new Stream()
    const stream3 = new Stream()

    let count = 1

    stream1.merge(stream2, stream3)
      ._events.on('data', (data) => {
        assert.equal(data, `the data ${count++}`)

        if (count === 4) done()
      })

    stream1._events.emit('data', 'the data 1')
    stream2._events.emit('data', 'the data 2')
    stream3._events.emit('data', 'the data 3')
  })
})
