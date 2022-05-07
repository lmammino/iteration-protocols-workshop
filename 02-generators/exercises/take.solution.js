/**
 * @template T
 * @param {number} n
 * @param {Iterable.<T>} iterable
 * @returns {Iterable.<T>}
 */
export default function * take (n, iterable) {
  let yielded = 0
  for (const value of iterable) {
    if (yielded >= n) { break }
    yield value
    yielded += 1
  }
}
