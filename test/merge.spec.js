'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.merge()', () => {

  const stream1 = new Stream()
  const stream2 = new Stream()
  const stream3 = new Stream()

  it('should return new stream listening to all merged once', (done) => {

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
