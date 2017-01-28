'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.read()', () => {

  const stream = new Stream()

  it('should read incoming data', (done) => {

    assert.equal(stream.read((data) => {
      assert.equal(data, 'the data')
      done()
    }) instanceof Stream, true)

    stream._events.emit('data', 'the data')
  })
})
