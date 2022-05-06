import tap from 'tap'

import fizzBuzzSolution from './fizzbuzz.solution.js'
import fizzBuzzTpl from './fizzbuzz.js'

const fizzBuzz = process.env.TEST_SOLUTIONS ? fizzBuzzSolution : fizzBuzzTpl

tap.test('fizzBuzz(15)', async function (t) {
  const seq = fizzBuzz(15)
  t.same(seq, [
    1,
    2,
    'Fizz', // 3 is divisible by 3
    4,
    'Buzz', // 5 is divisible by 5
    'Fizz', // 6 is dibisible by 3
    7,
    8,
    'Fizz', // 9 is divisible by 3
    'Buzz', // 10 is divisible by 5
    11,
    'Fizz', // 12 is divisible by 3
    13,
    14,
    'Fizz Buzz' // 15 is divisible both by 3 and 5
  ])
})

tap.test('fizzBuzz(30)', async function (t) {
  const seq = fizzBuzz(30)
  t.same(seq, [
    1,
    2,
    'Fizz', // 3 is divisible by 3
    4,
    'Buzz', // 5 is divisible by 5
    'Fizz', // 6 is dibisible by 3
    7,
    8,
    'Fizz', // 9 is divisible by 3
    'Buzz', // 10 is divisible by 5
    11,
    'Fizz', // 12 is divisible by 3
    13,
    14,
    'Fizz Buzz', // 15 is divisible both by 3 and 5
    16,
    17,
    'Fizz', // 18 is divisible by 3
    19,
    'Buzz', // 20 is divisible by 5
    'Fizz', // 21 is divisible by 3
    22,
    23,
    'Fizz', // 24 is divisible by 3
    'Buzz', // 25 is divisible by 5
    26,
    'Fizz', // 27 is divisible by 3
    28,
    29,
    'Fizz Buzz' // 30 is divisible both by 3 and 5
  ])
})

tap.test('fizzBuzz(1)', async function (t) {
  const seq = fizzBuzz(1)
  t.same(seq, [1])
})

tap.test('fizzBuzz(0)', async function (t) {
  const seq = fizzBuzz(0)
  t.same(seq, [])
})
