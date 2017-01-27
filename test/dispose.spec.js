'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.dispose()', () => {

  const stream = new Stream()

  it('should dispose all event listeners', (done) => {

    stream.on('data', (data) => {
      assert.equal(data, 'the data 1')
      stream.dispose()
      setTimeout(() => {
        done()
      }, 10)
    })

    stream.emit('data', 'the data 1')
    stream.emit('data', 'the data 2')
    stream.emit('data', 'the data 3')
  })
})
