/*
  Exercise
  Let's implement a `zip(iterable1, iterable2)` utility.

  This function receives two iterable objects.

  It returns a new iterable that will stop when one of source iterable is
  exhausted and it yields a pair of items respectively from iterable1 and iterable2.

  For example:

  ```js
  for (const item of zip(range(0,10), cycle(['even', 'odd']))) {
    console.log(item)
  }
  ```

  Should print:

  ```plain
  [0, 'even'],
  [1, 'odd'],
  [2, 'even'],
  [3, 'odd'],
  [4, 'even'],
  [5, 'odd'],
  [6, 'even'],
  [7, 'odd'],
  [8, 'even'],
  [9, 'odd']
  ```
*/

/**
 * @template T
 * @template S
 * @param {Iterable.<T>} iterable1
 * @param {Iterable.<S>} iterable2
 * @returns {Iterable.<[T,S]}>}
 */
export default function * zip (iterable1, iterable2) {
  // write your code here
  // Tip: if you want to support generic iterable objects (like arrays)
  // you can get an iterator from them with `obj[Symbol.iterator]()`.
}
