# 07 - Tips and Pitfalls


## Node.js Readable streams are async iterables

TODO:

```js
import { createReadStream } from 'fs'

const sourceStream = createReadStream('bigdata.csv')

let bytes = 0
for await (const chunk of sourceStream) {
  bytes += chunk.length
}

console.log(`bigdata.csv: ${bytes} bytes`)
```

But be careful if you are writing the data somewhere else... You might overload the destination if writing too fast (the infamous backpressure problem).

How do we handle backpressure when consuming streams as async iterables?

```js
import { createReadStream } from 'fs'
import { once } from 'events'

const sourceStream = createReadStream('bigdata.csv')
const destStream = new SlowTransform()

for await (const chunk of sourceStream) {
  const canContinue = destStream.write(chunk)
  if (!canContinue) {
    // backpressure, now we stop and we need to wait for drain
    await once(destStream, 'drain')
    // ok now it's safe to resume writing
  }
}
```

But if you are dealing with streaming pipelines it's probably easier to use [`pipeline()`](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback).

```js
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { createBrotliCompress } from 'zlib'

const sourceStream = createReadStream('bigdata.csv')
const compress = createBrotliCompress()
const destStream = createWriteStream('bigdata.csv.br')

await pipeline(
  sourceStream,
  compress,
  destStream
)
```

> ℹ️  If you want to learn more about Node.js streams, you can check out my [open source workshop about Node.js Streams](https://github.com/lmammino/streams-workshop).

TODO:


### Converting Node.js event emitters to Async Iterable

TODO:

```js
import { on } from 'events'
import glob from 'glob' // from npm

const matcher = glob('**/*.js')

for await (const [filePath] of on(matcher, 'match')) {
  console.log(filePath)
}
```

TODO:

But be careful because this code will never exit from the loop. The following code might now behave as you might expect:

```js
import { on } from 'events'
import glob from 'glob' // from npm

const matcher = glob('**/*.js')

for await (const [filePath] of on(matcher, 'match')) {
  console.log(filePath)
}

// ⚠️  DANGER, DANGER (high voltage ⚡️): We'll never get here!
console.log('ALL DONE! :)')
```

To handle termination of the loop correctly we would need to have a way to _signal_ that `match` events won't happen anymore.

We could do that as follows:

```js
import { on } from 'events'
import glob from 'glob'

const matcher = glob('**/*.js')
const ac = new global.AbortController()

matcher.once('end', () => ac.abort())

try {
  for await (const [filePath] of on(matcher, 'match', { signal: ac.signal })) {
    console.log(`./${filePath}`)
  }
} catch (err) {
  if (!ac.signal.aborted) {
    console.error(err)
    process.exit(1)
  }
  // we ignore the AbortError
}

console.log('NOW WE GETTING HERE! :)') // YAY! 😻
```

NOTE: If you know ahead of time how many events you need to process you can also use a `break` in the `for ... await` loop.


### Using async iterators to handle web requests

Can we use async iterators to handle web requests a-la-Deno? 🦕

```js
import { createServer } from 'http'
import { on } from 'events'

const server = createServer()
server.listen(8000)

for await (const [req, res] of on(server, 'request')) {
  res.end('hello dear friend')
}
```

EASY PEASY LEMON SQUEEZY! 🍋

But... wait, aren't we processing all requests in series, now? 😱

```js
import { createServer } from 'http'
import { on } from 'events'

const server = createServer()
server.listen(8000)

for await (const [req, res] of on(server, 'request')) {
  // ⚠️ ... AS LONG AS WE DON'T USE await HERE, WE ARE FINE!
}
```

You don't believe me, right? Ok, let's try this:

```js
import { createServer } from 'http'
import { on } from 'events'
import { setTimeout } from 'timers/promises'

const server = createServer()
server.listen(8000)

for await (const [req, res] of on(server, 'request')) {
  await setTimeout(1000)
  res.end('hello dear friend')
}
```

TODO: here show picture with autocannon performance and how we send 1 req/sec

Let's stick to the basics... 😅

```js
import { createServer } from 'http'
import { setTimeout } from 'timers/promises'

const server = createServer(async function (req, res) {
  await setTimeout(1000)
  res.end('hello dear friend')
})

server.listen(8000)
```

## Summary

TODO:

Iterable protocols are a way to standardize iteration in JavaScript and Node.js
Async iterators are ergonomic tools for sequential asynchronous iteration
But don't use them for everything!
Consuming data from paginated APIs or reading messages from a queue are good examples!
Handling web requests or events from an emitter might not be the best use cases!

That's all for now, congratulations on finishing the sixt and last chapter! 🎉

Take a little break and get ready to explore what you could do next and maybe some more challenging [exercises](/08-exercises/README.md).

---

| [⬅️ 06 - Async Iterable protocol](/06-async-iterable-protocol/README.md) | [🏠](/README.md)| [08 - Exercises ➡️](/08-exercises/README.md)|
|:--------------|:------:|------------------------------------------------:|