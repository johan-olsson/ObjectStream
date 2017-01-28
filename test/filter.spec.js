'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.filter()', () => {

  it('should return a new stream with the filtered data', (done) => {

    const stream = new Stream()
    const outstream = stream.filter((data) => {
      return data === 'the data2'
    })
    outstream._events.on('data', (data) => {
      assert.equal(data, 'the data2')
      done()
    })

    assert.equal(outstream instanceof Stream, true)

    stream._events.emit('data', 'the data')
    stream._events.emit('data', 'the data2')
  })

  it('should return a new stream with the filtered data async', (done) => {

    const stream = new Stream()
    const outstream = stream.filter((data, next) => {
      setTimeout(() => {
        next(data === 'the data2')
      }, 1)
    })
    outstream._events.on('data', (data) => {
      assert.equal(data, 'the data2')
      done()
    })

    assert.equal(outstream instanceof Stream, true)

    stream._events.emit('data', 'the data')
    stream._events.emit('data', 'the data2')
  })
})
