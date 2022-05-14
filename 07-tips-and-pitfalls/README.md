# 07 - Tips and Pitfalls

At this point, you acquired some pretty solid basics when it comes to iterable protocols. Well done for getting so far! 👏

If you are willing to go a tiny bit deeper, in this chapter we are going to explore some interesting tips and some scary pitfalls (and how to avoid them)!


## Node.js Readable streams are async iterables

I don't know if you know about Node.js streams... Well, if you don't I strongly suggest you look into them because they are awesome! Did I already tell you I have [a workshop like this one entirely dedicated to Node.js streams](https://github.com/lmammino/streams-workshop)? 😇

Ok, back to my point... If you know about Node.js streams, you might have realised already that streams (in particular Readable streams) kinda fit the bill of async iterables... I mean they are another abstraction that allows us to consume data that is ordered and becomes available asynchronously. We just tend to refers to the unit of streams as **chunks** while we generally talk about **items** or **pages** with async iterables.

Well, the point that I want to get to is... 🥁 ... Redable streams are also async iterables!

To see what all of that implies, let's discuss an example.

Let's say we want to use Node.js streams to count the number of bytes from standard input.

A quite standard way to do that would look like this:

```js
// count-bytes-stdin.js
let bytes = 0
process.stdin.on('data', (chunk) => {
  bytes += chunk.length
})
process.stdin.on('end', () => {
  console.log(`${bytes} bytes read from stdin`)
})
```

Note that `process.stdin` is a way to access standard input for a process in Node.js. This object is a Redable stream, so that's why we can listen to the `data` and the `end` events.

I have prepared a little example dataset, so we could use it to run the code above:

```bash
node 07-tips-and-pitfalls/count-bytes-stdin.js < 07-tips-and-pitfalls/assets/bigdata.csv
```

If you run this command you should see:

```plain
332637 bytes read from stdin
```

Which is not really _big data_ but should convince you that our stream based implementation works.

Ok, but we said that Readable streams are also async iterable objects, so we could write our count bytes example in a much nicer way (if you think that avoiding explicit events is nicer 😜):

```js
// count-bytes-stdin-async-iterable.js
let bytes = 0

for await (const chunk of process.stdin) {
  bytes += chunk.length
}

console.log(`${bytes} bytes read from stdin`)
```

Let's test this:

```bash
node 07-tips-and-pitfalls/count-bytes-stdin-async-iterable.js < 07-tips-and-pitfalls/assets/bigdata.csv
```

This prints:

```plain
332637 bytes read from stdin
```

So it works! 🎉

Isn't it much nicer that our code reads more sequentially and that we didn't have to worry about remembering and wiring very specific events? We just wanted a simple and convenient way to _loop over_ the chunks as they became available and that's what we get with `for await ... of`.

> ℹ️  Note that you can use `for await ... of` even with Transform streams. This is because transform streams have a both a Writable and a Readable part. When we try to use a Transform stream as an async iterable we are effectively reading data from the Readable part of the Transform stream.


## Streaming pipelines and handling backpressure

Now let's say that we want to modify our count bytes example a little. This time while we count the bytes we also want to write the data coming from standard input to a file called `data.bin`.

That doesn't seem to hard, so let's have a quick look at a possible implementation:



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