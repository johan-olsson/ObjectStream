'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.ended()', () => {


  it('should emit when stream ends', (done) => {

    const stream = new Stream()

    stream.ended(() => {
      assert.equal(1, 1)
      done()
    })

    stream._events.emit('end')
  })
})
