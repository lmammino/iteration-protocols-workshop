/**
 * @template T
 * @template S
 * @param {Iterable.<T>} iterable1
 * @param {Iterable.<S>} iterable2
 * @returns {Iterable.<[T,S]}>}
 */
export default function * zip (iterable1, iterable2) {
  // Supports arbitraty iterable objects like arrays, maps or sets
  const [it1, it2] = [iterable1[Symbol.iterator](), iterable2[Symbol.iterator]()]
  while (true) {
    const [next1, next2] = [it1.next(), it2.next()]
    if (next1.done || next2.done) { break }
    yield [next1.value, next2.value]
  }
}
