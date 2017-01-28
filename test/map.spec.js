'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.map()', () => {

  it('should return a new stream with the transformed data', (done) => {

    const stream = new Stream()
    const outstream = stream.map((data) => {
      return data + ' 34'
    })
    outstream._events.on('data', (data) => {
      assert.equal(data, 'the data 34')
      done()
    })

    assert.equal(outstream instanceof Stream, true)

    stream._events.emit('data', 'the data')
  })

  it('should return a new stream with the transformed data async', (done) => {

    const stream = new Stream()
    const outstream = stream.map((data, next) => {
      setTimeout(() => {
        next(data + ' 34')
      }, 1)
    })
    outstream._events.on('data', (data) => {
      assert.equal(data, 'the data 34')
      done()
    })

    assert.equal(outstream instanceof Stream, true)

    stream._events.emit('data', 'the data')
  })
})
