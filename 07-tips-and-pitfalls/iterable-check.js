function isIterable (obj) {
  return typeof obj[Symbol.iterator] === 'function'
}

const array = [1, 2, 3]
console.log(array, isIterable(array)) // true

const genericObj = { foo: 'bar' }
console.log(genericObj, isIterable(genericObj)) // false
console.log(Object.entries(genericObj), isIterable(Object.entries(genericObj))) // true

const fakeIterable = {
  [Symbol.iterator] () { return 'notAnIterator' }
}
console.log(fakeIterable, isIterable(fakeIterable)) // true 😡
