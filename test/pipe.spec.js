'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.pipe()', () => {

  it('should forward disposes', (done) => {

    const stream = new Stream()
    const outstream = new Stream()

    stream.pipe(outstream)

    outstream._events.on('end', () => {
      done()
    })

    assert.equal(outstream instanceof Stream, true)
    stream._events.emit('end')
  })

  it('should forward errors', (done) => {

    const stream = new Stream()
    const outstream = new Stream()

    stream.pipe(outstream)

    outstream.catch((err) => {
      assert.equal(err, 'the error')
      done()
    })

    assert.equal(outstream instanceof Stream, true)
    stream._events.emit('error', 'the error')
  })

  it('should pipe stream data to piped stream', (done) => {

    const stream = new Stream()
    const pipestream = new Stream()

    assert.equal(stream.pipe(pipestream) instanceof Stream, true)

    pipestream._events.on('data', (data) => {
      assert.equal(data, 'the data')
      done()
    })

    stream._events.emit('data', 'the data')
  })
})
