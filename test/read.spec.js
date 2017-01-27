'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.read()', () => {

  const stream = new Stream()

  it('should read incoming data', (done) => {

    stream.read((data) => {
      assert.equal(data, 'the data')
      done()
    })

    stream.emit('data', 'the data')
  })
})
