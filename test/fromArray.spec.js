'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.fromArray()', () => {

  it('should populate stream with given array', (done) => {

    const stream = new Stream()
    let index = 0

    stream.fromArray([0, 1, 2])
    stream.read((value) => {
      assert.equal(value, index)
      index++
    })

    stream._events.on('end', () => {
      done()
    })

    assert.equal(stream instanceof Stream, true)
    setTimeout(() => {
      stream._events.emit('end')
    })
  })
})
