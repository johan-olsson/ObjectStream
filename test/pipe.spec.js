'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.pipe()', () => {

  const stream = new Stream()
  const pipestream = new Stream()

  it('should pipe stream data to piped stream', (done) => {

    assert.equal(stream.pipe(pipestream) instanceof Stream, true)

    pipestream._events.on('data', (data) => {
      assert.equal(data, 'the data')
      done()
    })

    stream._events.emit('data', 'the data')
  })
})
