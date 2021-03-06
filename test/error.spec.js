'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.error()', () => {

  const stream = new Stream()

  it('should _events.emit( `error` with given error', (done) => {
    stream._events.on('error', (err) => {
      assert.equal(err, 'Some Error')
      done()
    })

    stream.error('Some Error')
  })
})
