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

That doesn't seem too hard, so let's have a quick look at a possible implementation:

```js
// copy-stdin.js
import { createWriteStream } from 'fs'

const dest = createWriteStream('data.bin')

let bytes = 0
for await (const chunk of process.stdin) {
  dest.write(chunk)
  bytes += chunk.length
}
dest.end()

console.log(`${bytes} written into data.bin`)
```

We can test this code with our lovely `bigdata.csv`:

```bash
node 07-tips-and-pitfalls/copy-stdin.js < 07-tips-and-pitfalls/assets/bigdata.csv
```

If all went according to plan, we should see the following output:

```plain
332637 written into data.bin
```

And we should have a new file called `data.bin` which contains a small (and fake) _bigdata_ treasure! 🤑

If we have a second look at the code, the only thing to report is that every time we get a new chunk of data from standard input, we write it down to a file using a Writable file stream. We do that by calling `write()` on the stream object.

If you know anything about Writable streams you should already be thinking about **backpressure**...

Backpressure happens when the data source and the destination work at very different throughputs. If we can read data much faster than we can write, we might end up in trouble. If we are not careful we will accumulate all the data (pending write) in memory and we might just blow the process out of memory.

Can this happen with our current example? Yes it can! Let's imagine we are saving `data.bin` to a very slow disk and that there is a lot of data (more than 2GB) coming through standard input.

So how do we know if we are accumulating too much data in memory and how do we stop the processing until all the writes have been flushed?

If we care to listen, the Writable stream can actually tell us if we are overloading it with too much data too fast!

How does it do that? It's actually simple: every time we call `write()`, the method returns a boolean value. We can interpret that value as answering the question _is it ok to send you more data?_ If the returned value is `true` it's ok to do another call to `write()`. If the value is `false` then the stream is already _under pressure_ and we should stop until further notice.

Ok, so if we see `false` we should stop, but how do we know when it's ok to start writing again?

Again, the writable stream will tell us. But this is an event that will happen at some point in the future, once the stream has flushed all the data pending write and the process has reclaimed all the accumulated memory. So the way that the stream can inform that it is safe to restart writing is through an event, specifically an event called `drain`.

So here's how we should update our script to handle backpressure correctly:

```js
// copy-stdin-backpressure.js
import { createWriteStream } from 'fs'
import { once } from 'events'

const dest = createWriteStream('data.bin')

let bytes = 0
for await (const chunk of process.stdin) {
  const canContinue = dest.write(chunk)
  bytes += chunk.length
  if (!canContinue) {
    // backpressure, now we stop and we need to wait for drain
    await once(dest, 'drain')
    // ok now it's safe to resume writing
  }
}
dest.end()

console.log(`${bytes} written into data.bin`)
```

The main change here is that we capture the return statement from the call to `write()` in a variable called `canContinue`. If we cannot continue we have to _suspend_ the loop until it's safe to continue, that is until the stream emits a `drain` event.

An interesting way to do that in a `for await ... of` loop is to use the [`once`](https://nodejs.org/api/events.html#emitteronceeventname-listener) utility from the core `events` module. `once` returns a promise that will resolve only when the specified event is emitted by the given event emitter. As the name suggests, `once` will listen only once for the event. Then it will detach its internal listener and resolve the `Promise` object that was originally returned.

`once` allows us to simply `await` inside the `for await ... of` loop, which has the effect of _suspending_ the iteration until the `drain` event is emitted.

Now that we know how to use async iterables and handle backpressure, let me tell you that for _complex enough_ pipelines (e.g. when you have more than 2 steps) it's much better (and simpler) to avoid async iterables and use the [`pipeline()`](https://nodejs.org/api/stream.html#streampipelinesource-transforms-destination-callback) function from the `stream/promise` module instead.

Just to illustrate my point, let me show you an example. In the following example we are still counting bytes and savind the data to a file, but this time we also want to compress the data while saving it.



```js
// copy-stdin-compress.js
import { Transform } from 'stream'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { createBrotliCompress } from 'zlib'

class CountBytes extends Transform {
  // ... omitted for brevity
}

const compress = createBrotliCompress()
const beforeCompression = new CountBytes()
const afterCompression = new CountBytes()
const destStream = createWriteStream('data.bin.br')

await pipeline(
  process.stdin,
  beforeCompression,
  compress,
  afterCompression,
  destStream
)

console.log(`Read ${beforeCompression.bytes} bytes and written ${afterCompression.bytes} bytes into "data.bin.br"`)
```

You can see how pipeline just connects all the different streams together and make the data flow. It will also handle backpressure correctly for us and return a `Promise` object that we can await to continue only when all the data has been consumed.

We can run this example with:

```bash
node 07-tips-and-pitfalls/copy-stdin-compress.js < 07-tips-and-pitfalls/assets/bigdata.csv
```

And this should output:

```plain
Read 332637 bytes and written 79956 bytes into "data.bin.br"
```

Sweet, Brotli compression seems to work quite well with our awesome bigdata file! 🙂


> ℹ️  If streams are confusing you (they can do that at first), you should really check out my [open source workshop about Node.js Streams](https://github.com/lmammino/streams-workshop) and take a deep dive on them.


### Converting Node.js event emitters to Async Iterable

We can generalise what we have just discussed for Node.js streams to event emitters.

Streams are event emitters after all: every time a new chunk is available the stream abstraction emits a `data` event.

Node.js offers a great utility function to build async iterators on top of any event emitter that might emit the same type of event over time.

This utility is the `on` function from the core module `events`.

To illustrate how `on` works, we can use the example of the `glob` library (from npm).

This library allows us to search for all files (and folders) matching a specific pattern. This library will traverse the file system recursively to find matches to our patterns. Every time there is a new match the `matcher` instance will emit a `match` event, which contains the path of the matched file.


```js
// find-js-files.js
import { on } from 'events'
import glob from 'glob' // from npm

const matcher = glob('**/*.js')

for await (const [filePath] of on(matcher, 'match')) {
  console.log(filePath)
}
```

If we run this code we should see a lot of files from this project (and the relative `node_modules` folder):

```plain
01-intro/for-in-debug.js
01-intro/for-in-object.js
01-intro/for-in.js
01-intro/for-of-map.js
01-intro/for-of-object-entries.js
// ...
node_modules/acorn-jsx/index.js
node_modules/acorn-jsx/xhtml.js
node_modules/aggregate-error/index.js
node_modules/ansi-regex/index.js
node_modules/ansi-styles/index.js
// ...
```

> **🎭 PLAY**  
> Do you want to know how many JavaScript files do you have in this folder alone? Just run: `node 07-tips-and-pitfalls/find-js-files.js | wc -l` and try not to be shocked by the result! 😅


Using `on` and `for await ... of` might look cool and very convenient, but be careful because this code will never exit from the loop.

In fact, the following code might now behave as you might expect:

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
// find-js-files-abort.js
import { on } from 'events'
import glob from 'glob'

const matcher = glob('**/*.js')
const ac = new global.AbortController()

matcher.once('end', () => ac.abort())

try {
  for await (const [filePath] of on(matcher, 'match', { signal: ac.signal })) {
    console.log(filePath)
  }
} catch (err) {
  if (!ac.signal.aborted) {
    console.error(err)
    process.exit(1)
  }
  // we ignore the AbortError
}

console.log('NOW WE ARE GETTING HERE! :)') // YAY! 😻
```

As you can see, `on` allows us to pass a _signal_ from an `AbortController`. When `on` receives the _abort_ signal from the controller, it just throws an `AbortError` which effectively stops the loop. We need to make sure we have a `try/catch` block and handle the error accordingly. 

If this seems like a lot of work... well, I won't argue, it is a lot of work! So consider this carefully, sometimes you might just better off using event listeners directly:

```js
// find-js-files-listeners.js
import glob from 'glob'

const matcher = glob('**/*.js')
matcher.on('match', console.log)
matcher.on('end', () => console.log('All completed!'))
```

Hard truth: `async/await` doesn't always lead to the nicest code! It's up to you to pick the best abstaction and the best coding style for the problem at hand when it comes to JavaScript!


> ℹ️ **NOTE**: If you know ahead of time how many events you need to process you can also use a `break` in the `for ... await` loop.


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