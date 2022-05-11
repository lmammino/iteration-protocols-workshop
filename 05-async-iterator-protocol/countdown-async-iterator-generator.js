import { setTimeout } from 'timers/promises'

async function * createAsyncCountdown (start, delay = 1000) {
  for (let i = start; i >= 0; i--) {
    await setTimeout(delay)
    yield i
  }
}

const countdown = createAsyncCountdown(3)
console.log(await countdown.next())
// { done: false, value: 3 }

console.log(await countdown.next())
// { done: false, value: 2 }

console.log(await countdown.next())
// { done: false, value: 1 }

console.log(await countdown.next())
// { done: false, value: 0 }

console.log(await countdown.next())
// { value: undefined, done: true }
