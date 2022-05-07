import tap from 'tap'

import zipSolution from './zip.solution.js'
import zipTpl from './zip.js'

const zip = process.env.TEST_SOLUTIONS ? zipSolution : zipTpl

/**
 * @template T
 * @param {[T]} values
 * @returns {Iterable.<T>}
 */
function * cycle (values) {
  let current = 0
  while (true) {
    yield values[current % values.length]
    current += 1
  }
}

/**
 * @param {number} start
 * @param {number} end
 * @returns {Iterable.<number>}
 */
function * range (start, end) {
  for (let i = start; i < end; i++) {
    yield i
  }
}

tap.test('zip(range(0,10), cycle([\'even\', \'odd\']))', async function (t) {
  const seq = [...zip(range(0, 10), cycle(['even', 'odd']))]
  t.same(seq, [
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
  ])
})

tap.test('zip([\'a\', \'b\', \'c\', \'d\'], [1, 2, 3]))', async function (t) {
  const seq = [...zip(['a', 'b', 'c'], [1, 2, 3])]
  t.same(seq, [
    ['a', 1],
    ['b', 2],
    ['c', 3]
  ])
})

tap.test('zip([], []))', async function (t) {
  const seq = [...zip([], [])]
  t.same(seq, [])
})
