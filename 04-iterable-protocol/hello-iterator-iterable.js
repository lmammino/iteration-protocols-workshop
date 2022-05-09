const iterableIterator = {
  next () {
    return { done: false, value: 'hello' }
  },
  [Symbol.iterator] () {
    return this
  }
}

iterableIterator.next()
// { done: false, value: "hello" }

for (const value of iterableIterator) {
  console.log(value)
}

// hello
// hello
// hello
// ...
