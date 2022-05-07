import tap from 'tap'

import takeSolution from './take.solution.js'
import takeTpl from './take.js'

const take = process.env.TEST_SOLUTIONS ? takeSolution : takeTpl

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

tap.test('take(4, cycle([\'even\', \'odd\']))', async function (t) {
  const seq = [...take(4, cycle(['even', 'odd']))]
  t.same(seq, [
    'even',
    'odd',
    'even',
    'odd'
  ])
})

tap.test('take(1, cycle([\'even\', \'odd\']))', async function (t) {
  const seq = [...take(1, cycle(['even', 'odd']))]
  t.same(seq, [
    'even'
  ])
})

tap.test('take(0, [])', async function (t) {
  const seq = take(0, [])
  t.same(seq, [])
})
