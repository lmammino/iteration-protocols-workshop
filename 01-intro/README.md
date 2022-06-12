# 01 - Introduction

There are many ways to do iteration in JavaScript, just to name a few:

  - `while`
  - `do ... while`
  - `for`
  - `for ... in`
  - `for ... of`
  - Array methods like `forEach`, `map`, `flatMap`, `reduce`, etc...
  - Generators
  - ...

> JavaScript even supports loop labels which can allow you to do crazy things that remind me of the infamous `GOTO` in Basic... but we are not going near this stuff here 🙈 (ok, ok... if you are really curious, check out this [example](https://gist.github.com/lmammino/868076ff5d863f88298a86eb4792fdd5)).

So, if we have all these different ways of doing iteration, why do we need **iteration protocols**? 🤔

Iteration protocols define **Iterators**, **Iterables**, **Async iterators** & **Async iterables**.

It's an attempt at standardising "iteration" behaviors by providing a consistent and interoperable API.

This standardisation is what allows us to use constructs such as `for...of`, `for await...of` and the spread operator on a variety of objects.

Knowing iteration protocols allows us:

  - Understand JavaScript better
  - Write more modern and idiomatic code
  - Be able to write our own custom iterators


## Syntax review

But, before we get into the weeds of iteration protocols, let's recap a little bit of JavaScript syntax.

Let's say that we have the following array:

```javascript
const judokas = [
  'Driulis Gonzalez Morales',
  'Ilias Iliadis',
  'Tadahiro Nomura',
  'Anton Geesink',
  'Teddy Riner',
  'Ryoko Tani'
]
```

and that we want to print all the items in the array.

One classic way to do this is:

```javascript
// for.js
for (let i = 0; i < judokas.length; i++) {
  console.log(judokas[i])
}
```

As expected, this will print:

```plain
Driulis Gonzalez Morales
Ilias Iliadis
Tadahiro Nomura
Anton Geesink
Teddy Riner
Ryoko Tani
```

There is nothing wrong with this approach, but let's admit that it requires us to specify a bunch of unnecessary details for the particular use cases:

  - how many times do we have to loop: `i < judokas.length`
  - how to increment the counter after every iteration: `i++`
  - how to explicitely access the current item: `judokas[i]`

We can do better!

> **Note**: "regular" `for` loop is not bad per se, but it makes sense to use it only with more advanced use cases (e.g. you need to traverse multi-dimensional arrays, you want to go throgh an array in reverse order, or pick only odd elements, or simply when you want to repeat an operation for a certain amount of times and you are not even dealing with a collection).


### `for ... of`

So, let's do better... with `for ... of`:

```javascript
// for-of.js
for (const judoka of judokas) {
  console.log(judoka)
}
```

This will produce the same output as with the previous snippet.

Isn't this much nicer to write (and read!)?

The intent here is definitely more clear: do something for every judoka *in* the collection. Well, I know here I said **in** but our code says **of**... bear with me for a second, we'll get there!

Before we get there, keep in mind that `for ... of` works with any **iterable** object.


#### `for ... of` with `String`

A `string` is an iterable object, so we can use `for ... of` with a string:

```javascript
// for-of-string.js
const judoka = 'Ryoko Tani'

for (const char of judoka) {
  console.log(char)
}
```

This prints:

```plain
R
y
o
k
o

T
a
n
i
```

We are printing every single character. It makes sense, right? A string is just a collection of caracters so it implements the iterator protocol to give us a nice way to iterate over all the characters!

Other iterable objects are `Set` and `Map`.


#### `for ... of` with `Set`

Let's see an example using a `Set`:

```javascript
// for-of-set.js
const medals = new Set([
  'gold',
  'silver',
  'bronze'
])

for (const medal of medals) {
  console.log(medal)
}
```

As you might expect, this prints:

```plain
gold
silver
bronze
```

#### `for ... of` with `Map`

Now let's see an example with a `Map`:

```javascript
// for-of-map.js
const medallists = new Map([
  ['Teddy Riner', 33],
  ['Driulis Gonzalez Morales', 16],
  ['Ryoko Tani', 16],
  ['Ilias Iliadis', 15]
])

for (const [judoka, medals] of medallists) {
  console.log(`${judoka} has won ${medals} medals`)
}
```

This prints:

```plain
Teddy Riner has won 33 medals
Driulis Gonzalez Morales has won 16 medals
Ryoko Tani has won 16 medals
Ilias Iliadis has won 15 medals
```

In this particular case it's interesting to see that the *item* returned in every iteration is an array with 2 elements containing the **current key** and the **current value**. We used array destructuring here to make things more concise and readable!


#### `for ... of` with `Object`

What happens if we use `for ... of` on an object? Let's find out:

```js
// for-of-object.js
const medallists = {
  'Teddy Riner': 33,
  'Driulis Gonzalez Morales': 16,
  'Ryoko Tani': 16,
  'Ilias Iliadis': 15
}

for (const [judoka, medals] of medallists) {
  console.log(`${judoka} has won ${medals} medals`)
}
```

Boom! 💣💥

If we run this code we get the following error:

```plain
for (const [judoka, medals] of medallists) {
                               ^

TypeError: medallists is not iterable
```

And here's our first lesson learned!

> **Note**: We can use `for ... of` only on iterable objects!

And it turns out that plain objects are not iterable by default.

So, what if we want to iterate over key/value pairs of a plain object?

We can do that with `Object.entries()`:

```js
// for-of-object-entries.js

const medallists = {
  'Teddy Riner': 33,
  'Driulis Gonzalez Morales': 16,
  'Ryoko Tani': 16,
  'Ilias Iliadis': 15
}

for (const [judoka, medals] of Object.entries(medallists)) {
  console.log(`${judoka} has won ${medals} medals`)
}
```

This will work and it will print:

```plain
Teddy Riner has won 33 medals
Driulis Gonzalez Morales has won 16 medals
Ryoko Tani has won 16 medals
Ilias Iliadis has won 15 medals
```

The reason why this works is because `Object.entries()` returns an **iterable** object which will produce items with the shape `[key, value]` for every iteration. Similar to what we saw for `Map`.


### `for ... in`

You might have heard about `for ... in` as well. Let's see what that does with an array:

```js
// for-in.js
const judokas = [
  'Driulis Gonzalez Morales',
  'Ilias Iliadis',
  'Tadahiro Nomura',
  'Anton Geesink',
  'Teddy Riner',
  'Ryoko Tani'
]

for (const judoka in judokas) {
  console.log(judoka)
}
```

Can you already guess what's going to be the output?

<details>
    <summary>🔎  Let's find out!</summary>
    
```plain
0
1
2
3
4
5
```

Not what you might have expected, right?!

</details>

The way `for ... in` works is that it **iterates over all the enumerable properties of an object**.

In the case of an array the enumerable properties are the array indices.

Let's see what happens with a plain object:

```js
// for-in-object.js
const medallists = {
  'Teddy Riner': 33,
  'Driulis Gonzalez Morales': 16,
  'Ryoko Tani': 16,
  'Ilias Iliadis': 15
}

for (const judoka in medallists) {
  console.log(`${judoka} has won ${medallists[judoka]} medals`)
}
```

Note how `judoka` will contain the current key, so we need to use `medallist[judoka]` if we want to access the current value for that key.

`for ... in` doesn't really have too many practical use cases.

One case where it could be useful is when you want to debug the properties of an object:

```js
// for-in-debug.js
const medallists = {
  'Teddy Riner': 33,
  'Driulis Gonzalez Morales': 16,
  'Ryoko Tani': 16,
  'Ilias Iliadis': 15
}

for (const prop in medallists) {
  console.log(`medallists[${prop}] = ${medallists[prop]}`);
}
```

This prints:

```plain
medallists[Teddy Riner] = 33
medallists[Driulis Gonzalez Morales] = 16
medallists[Ryoko Tani] = 16
medallists[Ilias Iliadis] = 15
```

Check out the [`for ... in` page on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) if you want to learn more about this statement.


### The spread syntax

The spread syntax is another interesting concept that applies to iterable objects.

This syntax is identified by `...iterableObj`: 3 dots and the name of the iterable object.

It allows us to "spread" all the elements of an iterable into an array, or to pass them as individual arguments to a function.

Let's see an example with an array:

```js
// spread-array.js
const countdown = [3, 2, 1, 0]
const from5to0 = [5, 4, ...countdown]
console.log(from5to0)
```

This prints:

```plain
[ 5, 4, 3, 2, 1, 0 ]
```

As we said, we can also use this syntax to pass the elements of an iterable as distinct arguments to a function call:

```js
// spread-function.js
const countdown = [3, 2, 1, 0]
console.log('countdown data:', ...countdown)
```

This is equivalent to calling:

```js
console.log('countdown data:', 3, 2, 1, 0)
```

and it produces the following output:

```plain
countdown data: 3 2 1 0
```

**Note:** `console.log()` accepts an arbitrary number of arguments and it will print all of them separated by a space.

Let's now see how we can use the spread syntax with objects:

```js
// spread-object.js
const judoInfo = {
  creator: 'Jigoro Kano',
  creationYear: 1882
}

const ranks = {
  belts: ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black', 'red-white', 'red'],
  dan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

const judo = { ...judoInfo, ...ranks }

console.log(judo)
```

This will output:

```plain
{
  creator: 'Jigoro Kano',
  creationYear: 1882,
  belts: [
    'white',  'yellow',
    'orange', 'green',
    'blue',   'brown',
    'black',  'red-white',
    'red'
  ],
  dan: [
     1,  2, 3, 4,  5,
     6,  7, 8, 9, 10,
    11, 12
  ]
}
```

It's a nice way to merge key-value pairs from different objects into one object.

**Note:** The spread syntax with objects has been introduced in EcmaScript 2018, so it's still relatively new and it might not be available in older browsers or Node.js runtimes. If you want to write code that is more broadly compatible you can use `Object.assign()` as an alternative way to merge object key-value pairs.


## Warm up your keyboard

Let's try a quick exercise to warm up a little:

> **🏹 Exercise** ([fizzbuzz.js](/01-intro/exercises/fizzbuzz.js))
>
> Write a function that implements the fizzBuzz game.
>
> A skeleton of the file is available at `01-intro/exercises/fizzbuzz.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with (from the root folder of the project):
>
> ```bash
> npm run ex -- 01-intro/exercises/fizzbuzz.test.js
> ```
>
> If you really struggle with this, you can have a look at [`fizzbuzz.solution.js`](/01-intro/exercises/fizzbuzz.solution.js) for a possible solution.

Was that too easy? Let's try something else:

> **🏹 Exercise** ([champions.js](/01-intro/exercises/champions.js))
>
> Let's do some data analysis and let's find the best Judo Olympics champions: athletes who have won at least 3 olympic medals in their career.
>
> A skeleton of the file is available at `01-intro/exercises/champions.js`.
>
> You can edit the file and run an interactive test session to validate your implementation with:
>
> ```bash
> npm run ex -- 01-intro/exercises/champions.test.js
> ```
>
> If you really struggle with this, you can have a look at [`champions.solution.js`](/01-intro/exercises/champions.solution.js) for a possible solution.


## Summary

Let's summarise what we have learned so far:

  - There are many (many many...) ways to do iteration in JavaScript.
  - Iteration protocols try to standardise how to make different types of objects iterable.
  - Iterable objects can be iterated over with `for ... of`.
  - You can also use the **spread syntax** to "spread" all the elements of an iterable into an array, or to pass them as individual arguments to a function.
  - The spread syntax can also be used to merge key-value pairs from different objects.
  - `for ... in` also exists and it allows us to iterate over all the enumerable properties of an object.



That's all for now, congratulations on finishing the first chapter! 🎉

Take a little break and get ready to move to the [Next section](/02-generators/README.md).

---

| [⬅️ 00 - README](/README.md) | [🏠](/README.md)| [02 - Generators ➡️](/02-generators/README.md)|
|:--------------|:------:|------------------------------------------------:|
