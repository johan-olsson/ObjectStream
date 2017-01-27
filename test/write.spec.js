'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.write()', () => {

  const stream = new Stream()

  it('should write data to current stream', (done) => {

    stream.on('data', (data) => {
      assert.equal(data, 'the data')
      done()
    })

    stream.write('the data')
  })
})
