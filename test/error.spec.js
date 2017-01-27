'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.error()', () => {

  const stream = new Stream()

  it('should emit `uncaughtException` with given error', (done) => {
    stream.on('uncaughtException', (err) => {
      assert.equal(err, 'Some Error')
      done()
    })

    stream.error('Some Error')
  })
})
