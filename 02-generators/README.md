# 02 - Generators

JavaScript offers an interesting feature that can be very useful in the context of iteration: **generator functions**.

We can define a generator function as a function with a super power: a generator **can be suspended** and then **resumed at a later time**.

Generators are well suited to implement iterators and (little spoiler) they produce objects that implement both the **iterator** and the **iterable** protocol.

## Syntax

To define a generator function we need to use the `function*` declaration (`function` keyword followed by an asterisk):

```js
function * myGenerator () {
  // generator body
}
```

Invoking a generator will not execute its body immediately. It will instead return a **generator object**.

A generator object exposes the `next()` method which can be used to start or resume the execution of the generator function.

A generator function can decide to suspend the execution by using the keyword `yield` inside the function body.

`yield` works in a similar way to a `return` statement, meaning that it allows to return a value back to the caller.

When we invoke `next()` on a generator object for the first time, it will execute its body until the very first `yield` statement. At this point the execution is supended and control is given back to the caller. The caller receives an object with the following shape:

```js
{
  done: false,
  value: 'someValue'
}
```

- **`done`** is a boolean value that indicates wheter the generator is exhausted (completed) or not
- **`value`** represents the value _returned_ by the `yield` statement that suspended the execution.

If the caller invokes `next()` again, the generator function will resume the execution. This means that the generator function keeps track of its internal state: it remembers the value of all the variables and where the execution was stopped. This allows the generator function to continue the execution from where it was left off.

Let's clarify all these concepts with a simple example:

```js
// fruit-generator.js
function * fruitGenerator () {
  yield '🍑'
  yield '🍉'
  yield '🍋'
  yield '🥭'
}

const fruitGeneratorObj = fruitGenerator()
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
```

This snippet will print:

```plain
{ value: '🍑', done: false }
{ value: '🍉', done: false }
{ value: '🍋', done: false }
{ value: '🥭', done: false }
{ value: undefined, done: true }
```

Can you see now how the generator object can _resume_ its execution when we call `next()`?

A generator can also use the `return` statement to _yield_ one last value and stop the iteration:

```js
// fruit-generator-return.js
function * fruitGenerator () {
  yield '🍑'
  yield '🍉'
  yield '🍋'
  return '🥭'
}

const fruitGeneratorObj = fruitGenerator()
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
console.log(fruitGeneratorObj.next())
```

The code above outputs:

```plain
{ value: '🍑', done: false }
{ value: '🍉', done: false }
{ value: '🍋', done: false }
{ value: '🥭', done: true }
```

Note how the latest value has already `done: true`.

We said that generator objects are also iterable, this means that we can use `for ... of` with them!

So we could rewrite the previous example as follow:

```js
// fruit-generator-iterable.js
function * fruitGenerator () {
  yield '🍑'
  yield '🍉'
  yield '🍋'
  yield '🥭'
}

const fruitGeneratorObj = fruitGenerator()
for (const fruit of fruitGeneratorObj) {
  console.log(fruit)
}
```

This code produces the following output:

```plain
🍑
🍉
🍋
🥭
```

With the `for ... of` syntax we don't have to worry about checking the `done` field and extracting the `value` field by ourselves.

Generators support a bunch of additional features like [delegation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield*), [two way data passing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/next#sending_values_to_the_generator) and [error generation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator/throw), but for the sake of this workshop we are going to focus only on the basics and learn how to use generator functions to create iterators and iterable objects.

Let's see then a few interesting examples that we can build with generators.

## A `range` utility

Many languageas (e.g. Python) have a utility that allows you to easily generate a range of values.

This utility can be used for to simplify iteration and avoid the classic `for(var, cond, incr)` loop.

For instance, assuming we had this range utility, if we wanted to print the first 10 positive numbers we could write something like this:

```js
for (const i of range(0, 11)) {
  console.log(i)
}
```

This would be pretty much equivalent to:

```js
for (let i = 0; i < 11; i++) {
  console.log(i)
}
```

Which one do you think reads better?

I vote for the `range` one. So let's see how we could implement that with generator functions:

```js
// range.js
function * range (start, end) {
  for (let i = start; i < end; i++) {
    yield i
  }
}
```

The interesting part is that we are effectively abstracting a _classic_ `for` loop and leveraging the resumability of generators to yield a value per every iteration.


> **🎭 PLAY**  
> Can you modify this `range` function to support an arbitrary step (e.g. increment by 2 rather than by 1)?


> **🎭 PLAY**  
> Can you also modify this `range` function to work with decreasing values (e.g. go from 10 to 0)?


## A `cycle` utility

Another classic iterator utility available in other languages (hello again, Python 🐍) is the `cycle` utility.

It allows you to pass a sequence of values and it will yield one of these value per every iteration. Once the values are finished it will restart from the beginning. When is this going to finish? Never!

Yes, generators are **lazy**, meaning that they produce (_yield_) values on demand and they can also produce and **endless** sequence of values.

Let's see how we could implement this cycle utility:

```js
// cycle.js
function * cycle (values) {
  let current = 0
  while (true) {
    yield values[current % values.length]
    current += 1
  }
}
```

See that `while (true)`? That should immediately give you the idea that this iterator could go on forever!

So what happens if we use `cycle` with `for ... of`? Let's find out:

```js
for (const value of cycle(['even', 'odd'])) {
  console.log(value)
}
```

This will print:

```plain
even
odd
even
odd
even
odd
even
odd
even
...
```

and, yes... it will never finish!


## Exercises

But how to deal with endless iterators and avoid endless loops? One way is to avoid `for ... of` and use `next()` explicitly.

Another approach might be to create another utility function called `take(n, iterable)` that gives us another iterable that will stop when the iterable is completed or when `n` items have been yielded.

Let's implement `take` as an exercise:

> **🏹 Exercise** ([take.js](/02-generators/exercises/take.js))
>
> Let's implement the `take(n, iterable)` utility:
>
> A skeleton of the file is available at `02-generators/exercises/take.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with:
>
> ```bash
> npm run ex -- 02-generators/exercises/take.test.js
> ```
>
> If you really struggle with this, you can have a look at [`take.solution.js`](/02-generators/exercises/take.solution.js) for a possible solution.

Ok, if you want to push yourself a bit more, let's try another one!

> **🏹 Exercise** ([zip.js](/02-generators/exercises/zip.js))
>
> Let's implement the `zip(iterable1, iterable2)` utility:
>
> A skeleton of the file is available at `02-generators/exercises/zip.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with:
>
> ```bash
> npm run ex -- 02-generators/exercises/zip.test.js
> ```
>
> If you really struggle with this, you can have a look at [`zip.solution.js`](/02-generators/exercises/zip.solution.js) for a possible solution.

> **🎭 PLAY**  
> Did you manage to implement `zip`? Well done you! Now can you implement a more generic version of `zip` that accepts an arbitrary number of iterables as arguments? If you pass N iterables it should create a new iterable that yields an array of N items (1 from every iterable).


## Summary

- Generator functions are a special type of function.
- A generator function returns a **generator object** which is both an **iterator** and an **iterable**.
- A generator function can use `yield` to _yield_ a value a pause it's execution. The execution can be resumed by the caller.
- Generator functions are a great way to create custom iterable objects.
- Generator objects are **lazy** (they resume and yield only when you explicitly call `next()`) and they can be **endless**.


That's all for now, congratulations on finishing the second chapter! 🎉

Take a little break and get ready to move to the [Next section](/03-iterator-protocol/README.md).

---

| [⬅️ 01 - Introduction](/01-intro/README.md) | [🏠](/README.md)| [03 - Iterator protocol ➡️](/03-iterator-protocol/README.md)|
|:--------------|:------:|------------------------------------------------:|
