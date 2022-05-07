/*
  Exercise
  Let's implement a `take(n, iterable)` utility.

  This function receives a positive integer and an iterable.

  It returns a new iterable that will stop when the source iterable is
  completed or when `n` items have been already yielded.

  For example:

  ```js
  for (const item of take(4, cycle(['even', 'odd']))) {
    console.log(item)
  }
  ```

  Should print:

  ```plain
  even
  odd
  even
  odd
  ```
*/

/**
 * @template T
 * @param {number} n
 * @param {Iterable.<T>} iterable
 * @returns {Iterable.<T>}
 */
export default function * take (n, iterable) {
  // Note that this is already a generator function,
  // so it already returns an Iterable. You "just" need to use
  // `yield` correctly...
  //
  // Write your code here!
}
