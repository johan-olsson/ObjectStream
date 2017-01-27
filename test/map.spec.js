'use strict'

const assert = require('assert')
const Stream = require('../')

describe('objectstream.map()', () => {

  const stream = new Stream()

  it('should return a new stream with the transformed data', (done) => {

    stream.map((data) => {
      return data + ' 34'
    })
    .on('data', (data) => {
      assert.equal(data, 'the data 34')
      done()
    })

    stream.emit('data', 'the data')
  })
})
