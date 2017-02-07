# objectstreamer [![Build Status](https://travis-ci.org/johan-olsson/ObjectStream.svg?branch=master)](https://travis-ci.org/johan-olsson/ObjectStream)

## Install and Test

```shell

npm install --save objectstreamer

npm test
npm run coverage
```

## How it works

### Read and Write

```javascript
const stream = new Objectstreamer()

stream.read(data => {
  console.log(data) // { some: 'data' }
})

stream.write({
})
some: 'data'
```

### Transforming data

#### stream.filter()

Filters behaves much like `Array.filter`

```javascript
const stream = new Objectstreamer()

stream.filter(data => {
    return data.type === 'fruit'
  })
  .read((data) => {
    console.log(`${data.name} is a fruit`) // Apple is a fruit
                                           // Orange is a fruit
  })

stream.write({
  type: 'fruit',
  name: 'Apple'
})

stream.write({
  type: 'berry',
  name: 'Banana'
})

stream.write({
  type: 'fruit',
  name: 'Orange'
})
```

If a promise is returned that promise will be used instead

```javascript
const stream = new Objectstreamer()

stream.filter(data => {
    return new Promise((resolve, reject) => {
      resolve(data.type === 'fruit')
    })
  })
  .read((data) => {
    console.log(`${data.name} is a fruit`) // Apple is a fruit
                                           // Orange is a fruit
  })
```

#### stream.map()

Filters behaves much like `Array.map`

```javascript
const stream = new Objectstreamer()

stream.map(data => ({
    type: data.type,
    name: data.name,
    description: `Don't know nothing about ${data.name}.`
  }))
  .read((data) => {
    console.log(data.description) // Don't know nothing about Apple.
                                  // Don't know nothing about Banana.
  })

stream.write({
  type: 'fruit',
  name: 'Apple'
})

stream.write({
  type: 'berry',
  name: 'Banana'
})
```

Async maps can be useful for fetching data from wikipedia for example.

```javascript
const stream = new Objectstreamer()

const base_url = 'https://en.wikipedia.org/w/api.php'

stream.map(data => {
  return fetch(`${base_url}?action=opensearch&format=json&origin=*&search=${data.name}`)
    .then((res) => req.json())
    .then((res) => {
      return Promise.resolve({
        type: data.type,
        name: data.name,
        description: res[2][0]
      })
    })
  })
  .read((data) => {
    console.log(data) // The apple tree (Malus pumila, commonly and erroneously called Malus domestica) is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple.
                      // The banana is an edible fruit – botanically a berry – produced by several kinds of large herbaceous flowering plants in the genus Musa.
  })

stream.write({
  type: 'fruit',
  name: 'Apple'
})

stream.write({
  type: 'berry',
  name: 'Banana'
})

```

### Transforming streams

#### stream.pipe()

```javascript

const stream1 = new Objectstreamer()
const stream2 = new Objectstreamer()

stream1.pipe(stream2)

stream1.read(console.log) // Hello from stream1
stream2.read(console.log) // Hello from stream1
                          // Hello from stream2

stream1.write('Hello from stream1')
stream2.write('Hello from stream2')

```

#### stream.proxy()

```javascript

const stream1 = new Objectstreamer()
const stream2 = new Objectstreamer()

stream1.proxy(stream2)

stream1.read(console.log) // Hello from stream1
                          // Hello from stream2
stream2.read(console.log) // Hello from stream1

stream1.write('Hello from stream1')
stream2.write('Hello from stream2')

```

#### stream.merge()

```javascript

const stream1 = new Objectstreamer()
const stream2 = new Objectstreamer()
const stream3 = new Objectstreamer()

stream1.merge(stream2, stream3)
  .read(console.log) // Hello from stream1
                     // Hello from stream2
                     // Hello from stream3

stream1.write('Hello from stream1')
stream2.write('Hello from stream2')
stream3.write('Hello from stream3')

```

### Stream Error handling

#### stream.error() / stream.catch()

```javascript

const stream = new Objectstreamer()

stream.catch(console.log) // Error: Something feels wrong...
stream.error(new Error('Something feels wrong...'))


```


### Events

#### stream.dispose() / stream.ended()

```javascript

const stream1 = new Objectstreamer()
const stream2 = new Objectstreamer()

stream1.pipe(stream2)

stream1.ended(() => {
  console.log('Stream1 ended')
})
stream2.ended(() => {
  console.log('Stream2 ended')
})

stream1.dispose() // Stream2 ended
                  // Stream1 ended


```
