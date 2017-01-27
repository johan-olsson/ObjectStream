'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.pipe()', () => {

  const stream = new Stream()
  const pipestream = new Stream()

  it('should pipe stream data to piped stream', (done) => {

    stream.pipe(pipestream)

    pipestream.on('data', (data) => {
      assert.equal(data, 'the data')
      done()
    })

    stream.emit('data', 'the data')
  })
})
