'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.catch()', () => {


  it('should catch errors', (done) => {

    const stream = new Stream()

    stream.catch((error) => {
      assert.equal(error, 'the error')
      done()
    })

    stream.emit('uncaughtException', 'the error')
  })
})
