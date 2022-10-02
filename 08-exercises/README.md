# 08 - Exercises

In this last section you will find some ideas of small projects and exercises that you can build to practice your acquired knowledge of JavaScript iteration protocols.

## Exercises

For the following exercises you don't get a testing suite nor a solution, so be creative and have fun!

Feel free to share your solutions on GitHub and let me know on [Twitter](https://twitter.com/loige).


### 08.01 Lines iterator

Implement an iterable object that, given a text, will yield a line of that input text for every iteration.

For instance:

```js
const text = `I've got another confession to make
I'm your fool
Everyone's got their chains to break
Holding you`

const lines = linesIter(text)
lines.next() // { done: false, value: 'I\'ve got another confession to make' }
lines.next() // { done: false, value: 'I\'m your fool' }
lines.next() // { done: false, value: 'Everyone\'s got their chains to break' }
lines.next() // { done: false, value: 'Holding you' }
lines.next() // { done: true, value: undefined }
```


### 08.02 Incremental find

Create an iterable object that allows you to search an occurrence of a certain keyword in a given text. The search should be lazy and give you one occurrence per every iteration. Every occurrence should be represented by the line number and the initial position of the match in that line (column index).

For instance, if you have the following text:

```js
const text = `Were you born to resist or be abused
Is someone getting the best, the best, the best, the best of you
Is someone getting the best, the best, the best, the best of you`
```

We might want to search for the word `best` as follows:

```js
const finder = find(text, 'best')
finder.next() // { done: false, value: { line: 1, col: 24 } }
finder.next() // { done: false, value: { line: 1, col: 34 } }
finder.next() // { done: false, value: { line: 1, col: 44 } }
finder.next() // { done: false, value: { line: 1, col: 54 } }
finder.next() // { done: false, value: { line: 2, col: 24 } }
finder.next() // { done: false, value: { line: 2, col: 34 } }
finder.next() // { done: false, value: { line: 2, col: 44 } }
finder.next() // { done: false, value: { line: 2, col: 54 } }
finder.next() // { done: true, value: undefined }
```

Can you implement the `find` function to work as described in this example?


### 08.03 Enumerate utility

Python, Rust and other languages have an interesting utility when it comes to iterators: the `enumerate` utility.

Let's a Python example to illustrate how `enumerate()` works:

```python
values = ['a','b','c']
for count, value in enumerate(values):
    print(count, value)
```

This code prints:

```plain
0 a
1 b
2 c
```

Unfortunately `enumerate` does not exist in JavaScript, but based on what we learned in this workshop we should be able to implement it ourselves, right?

And yes, ideally our implementation of `enumerate` should be lazy: it should take an iterable object as input and produce a new iterable object.


### 08.04 Map utility

Python, Rust and other languages also have another interesting utility called `map`. Map allows you to use an arbitraty function to change the values produced by an iterable as you iterate through them.

Let's see a Python example to clarify what we mean:

```python
def square(number):
    return number ** 2

numbers = [1, 2, 3, 4]
squared = map(square, numbers)

for num in squared:
    print(num)
```

This will print:

```plain
1
4
9
16
```

At a first glance, you might think that this is not too different from [`Array.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) in JavaScript. The problem is that `Array.map()` only works with arrays and not with generic iterable objects (it's not lazy).

We want to implement something more generic that works with iterables: it takes an iterable object and produces a new iterable object, like in Python!


### 08.05 Async map

Can we implement the same `map()` utility as in the previous exercise, but this time make it work with **async iterable** objects like Readable streams?

We want something that could allow us to do this:

```js
import { createReadStream } from 'node:fs'

const asyncMap = async function * (stream, transform) {
  // TODO
}

const textStream = createReadStream('some-file.txt')
const uppercasifiedStream = asyncMap(textStream, (chunk) => chunk.toString().toUpperCase())

for await (const chunk of uppercasifiedStream) {
  console.log(chunk)
}
```

Can you complete the implementation of `asyncMap`?


### 08.06 Re-implement `on` from `events`

We have already discussed how `on` from the core module `events` work. Would you be able to re-implement it from scratch by yourself?

If you really have no clue, you could always have a peek at [the official implementation](https://github.com/nodejs/node/blob/bd86e5186a33803aa9283b9a4c6946da33b67511/lib/events.js#L1012-L1137), or run the following snippet in a Node.js shell:

```js
const { on } = require('events')
console.log(on.toString())
```

Well, if you think that's a lot of code, try to implement a simplified version that doesn't care about error handling or abort signals.


### 08.07 Events debounce

Let's say you want to listen to events, but if they happen too often you should ignore them. This is called **debouncing** and it something common in the frontend world, but it might also be useful on the backend. For instance, let's say that we have a `sensor` object emitting readings frequently (once every 100ms) and that we only want to log them at most once per second:

```js
import { EventEmitter } from 'node:events'

const sensor = new EventEmitter()
setInterval(() => sensor.emit('reading', Math.random()), 100)

async function * debounce (sensor, event = 'reading', everyMs = 1000) {
  // TODO ...
}

for await (const reading of debounce(sensor)) {
  console.log(reading)
}
```

Can you complete the implementation of `debounce`?


## Where to go from here

I hope you had fun with this workshop and that you also acquired some new practical learnings that you can bring to your next project.

If you want to keep learning about JavaScript, Node.js and iteration protocols, these are some interesting resources:

 - [Node.js Design Patterns, Third Edition](https://www.nodejsdesignpatterns.com/): has an entire section dedicated to iteration protocols and related design patterns (disclaimer: I co-authored this book!)
 - [JavaScript Async Iterator](https://www.nodejsdesignpatterns.com/blog/javascript-async-iterators/): An article that recaps most of the topics discussed in this workshop.
 - Learn [how I found a lost song using JavaScript and Async Iterators](https://youtu.be/uTzBHPpMEhA) (talk from NodeConfRemote 2021). You can also look at [the slides](https://loige.link/nodeconf-iter).
 - [Official (sync) Iteration protocols documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols): the goto place to make sure you didn't miss anything important about iteration protocols or just to quickly review something you don't remember.
 - [Official documentation about Async iterators and iterable on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator): Similar to the above but covers some details about the async counterparts of the iterator and iterable protocols.
 - [Official documentation about `for await ... of` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of): Gives you some more details about this syntax and when you can use it.

Let me know what you are going to build with your new acquired knowledge on [Twitter](https://twitter.com/loige), and you found this useful, please give it a star ⭐️ and share it with your friends and colleagues! ❤️

Thank you! 👋

---

| [⬅️ 07 - Tips and Pitfalls](/07-tips-and-pitfalls/README.md) | [🏠](/README.md)| - |
|:--------------|:------:|------------------------------------------------:|