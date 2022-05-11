# 05 - Async Iterator Protocol

Everything we have discussed so far is **synchronous**.

This means that we can use the protocols and the techniques that we learned so far to iterate over data that is already available in memory or that it can be _produced_ synchronously.

This is great, but more often than not, JavaScript code tends to be **asynchronous**. In fact, often, our code needs to use data from files, network sockets, HTTP servers (APIs), databases, etc.

Can we apply the same principles that we learned to far in **a**synchronous situations?

The classic example is a **paginated dataset**: you need to consume a significant amount of data, so that data is exposed to you in pages. Every page contains a chunk of the whole data and you explicitly need to request the next page to keep going.

Traversing a paginated dataset generally looks like this:

  1. Get the first page
  2. Use the data from the first page
  3. Request the next page
  4. Use the data from the next page
  5. ... repeat from **3.** until there are no more pages left

Do you recall this pattern from dealing with databases and APIs?

Wouldn't it be nice if we could handle this kind of situations by doing something like this? 👇

```js
for (const currentPage of somePaginatedDataset) {
  // process data from `currentPage`
}
```

Well, yes, but this `for ... of` loop is synchronous! 🤔

We need an equivalent **a**synchronous version of this loop, something that can wait for data to be available asynchronously before triggering the next iteration.

It turns out that what we want actually exists and it's called [`for await ... of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of):

```js
for await (const currentPage of somePaginatedDataset) {
  // process data from `currentPage`
}
```

Note the use of `await` after `for`!

We can use this kind of syntax with **async iterables**, but before we get there, we need to learn about **async iterators**!


## The async iterator protocol

An object is an **async iterator** if it has a `next()` method. Every time you call it, it returns **a promise that resolves** to an object with the keys `done` (boolean) and `value`.

TODO: from here

That's all for now, congratulations on finishing the fifth chapter! 🎉

Take a little break and get ready to move to the [Next section](/06-async-iterable-protocol/README.md).

---

| [⬅️ 04 - Iterable protocol](/04-iterable-protocol/README.md) | [🏠](/README.md)| [06 - Async Iterable protocol ➡️](/06-async-iterable-protocol/README.md)|
|:--------------|:------:|------------------------------------------------:|