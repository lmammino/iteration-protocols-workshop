import tap from 'tap'

import * as entriesIterableSolution from './entries.solution.js'
import * as entriesIterableTpl from './entries.js'

const solution = process.env.TEST_SOLUTIONS ? entriesIterableSolution : entriesIterableTpl

tap.test('produce key value pairs', async function (t) {
  const obj = {
    foo: 'bar',
    baz: 'quz',
    qux: 'quux',
    corge: 'grault',
    garply: 'waldo',
    fred: 'plugh',
    xyzzy: 'thud'
  }
  const expected = [
    ['foo', 'bar'],
    ['baz', 'quz'],
    ['qux', 'quux'],
    ['corge', 'grault'],
    ['garply', 'waldo'],
    ['fred', 'plugh'],
    ['xyzzy', 'thud']
  ]

  const iter = solution.entriesIterable(obj)
  const pairs = [...iter]
  t.same(pairs, expected)
})

tap.test('an empty obj does not produce anything', async function (t) {
  const iter = solution.entriesIterable({})
  const pairs = [...iter]
  t.same(pairs, [])
})
