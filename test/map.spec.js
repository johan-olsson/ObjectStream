'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.map()', () => {

  it('should forward disposes', (done) => {

    const stream = new Stream()
    const outstream = stream.map((data) => {
      return data === 'the data2'
    })

    outstream._events.on('end', () => {
      done()
    })

    assert.equal(outstream instanceof Stream, true)
    stream.dispose()
  })

  it('should forward errors', (done) => {

    const stream = new Stream()
    const outstream = stream.map((data) => {
      return data === 'the data2'
    })

    outstream.catch((err) => {
      assert.equal(err, 'the error')
      done()
    })

    assert.equal(outstream instanceof Stream, true)
    stream._events.emit('error', 'the error')
  })

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
    const outstream = stream.map((data) => {
      return new Promise((resolve) => {
        resolve(data + ' 34')
      })
    })
    outstream._events.on('data', (data) => {
      assert.equal(data, 'the data 34')
      done()
    })

    assert.equal(outstream instanceof Stream, true)

    stream._events.emit('data', 'the data')
  })
})
