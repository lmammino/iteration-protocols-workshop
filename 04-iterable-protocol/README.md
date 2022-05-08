# 04 - Iterable Protocol

In the previous chapter we said that an **iterable** is an object that abstracts a collection of items that we can iterate on sequentially.

Before getting into the **iterable protocol**, let review some interesting use cases where we can use iterable objects in JavaScript.

We already mentioned the `for ... of` loop and the Spread operator. But there's more:

  - Destructuring via an Array pattern (e.g. `const [head, ...tail] = iterable`)
  - `Array.from()`
  - Constructors of `Map`, `WeakMap`, `Set` and `WeakSet`
  - An iterable where the items are promises can be passed to `Promise.all()` or `Promise.race()`

I hope this is enough for you to be excited about the prospect of learning more about iterables! 😛


## The iterable protocol

In JavaScript an object is **iterable** if it has a special **property called `Symbol.iterator`**. This property needs to be a zero-argument function that **returns an iterator**.

We already know how to create an iterator, so to make an object iterable we just need to return an iterator from its `Symbol.iterator` function.

Let's see how that looks like for our countdown example:

```js
// countdown.js
function createCountdown (start) {
  let nextVal = start
  return {
    [Symbol.iterator]: () => ({
      next () {
        if (nextVal < 0) {
          return { done: true }
        }
        return {
          done: false,
          value: nextVal--
        }
      }
    })
  }
}
```

Note, how the code of the `Symbol.iterator` function is pretty much the same as our iterator example from the previous chapter...

Because now `createCountdown` produces an iterable, that means that we can do cool things like using `for ... of` loops with it:

```js
const countdown = createCountdown(3)
for (const value of countdown) {
  console.log(value)
}
```

As you might expect, this prints:

```plain
3
2
1
0
```

In this example we used a factory function to create an anonymous object that is an iterable. As we did for the iterator example, also for an iterable we could use a class based approach or generator functions.

Let's see how to rewrite our iterable countdown using a class:

```js
// countdown-class.js
class Countdown {
  constructor (start) {
    this.nextVal = start
  }

  [Symbol.iterator] () {
    let nextVal = this.nextVal
    return ({
      next () {
        if (nextVal < 0) {
          return { done: true }
        }
        return {
          done: false,
          value: nextVal--
        }
      }
    })
  }
}
```

As per the protocol, everytime we call `Symbol.iterator` we get back an iterator object.

One important note here is that every time we call this method we get a **new** iterator object. This means that we can instantiate the iterable once and do as many `for ... of` as we want and everytime we will restart the countdown from the beginning:

```js
const countdown = new Countdown(3)

for (const value of countdown) {
  console.log(value)
}

console.log('\n--- trying again ---\n')

for (const value of countdown) {
  console.log(value)
}
```

This produces the following output:

```plain
3
2
1
0

--- trying again ---

3
2
1
0
```

> **🎭 PLAY**  
> What do you think is going to happen if we do this with the factory function implementation? Why don't you try?

> ℹ️  Making iterable objects resumable is a design choice that needs to be considered case by case. Sometimes it can make sense (like with out countdown example), sometimes it doesn't. Sometimes it is not even possible.
> 
> If you are using third party iterables, make no assumption and check their documentation. Or if you really want to try to make an assumption stay on the safe side and assume that iterables are not resumable.

Let's now see how to implement our countdown iterable using generator functions:

```js
// countdown-generator.js
function * countdownGen (start) {
  for (let i = start; i >= 0; i--) {
    yield i
  }
}
```

Wait, isn't this exactly the same code as per our iterator example from the previous chapter? 😨

How is it possible that the same code is both an iterator and an iterable?

Let's find out!


## Iterator and Iterable together!

TODO: show example of countdown (class) that is both an iterator and an iterable


## Exercises

TODO: convert exercise from previous chapters to iterable


## Summary

TODO: write summary

That's all for now, congratulations on finishing the fourth chapter! 🎉

Take a little break and get ready to move to the [Next section](/05-async-iterator-protocol/README.md).

---

| [⬅️ 03 - Iterator protocol](/03-iterator-protocol/README.md) | [🏠](/README.md)| [05 - Async Iterator protocol ➡️](/05-async-iterator-protocol/README.md)|
|:--------------|:------:|------------------------------------------------:|