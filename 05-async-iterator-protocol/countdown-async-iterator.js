import { setTimeout } from 'node:timers/promises'

function createAsyncCountdown (from, delay = 1000) {
  let nextVal = from
  return {
    async next () {
      await setTimeout(delay)
      if (nextVal < 0) {
        return { done: true }
      }

      return { done: false, value: nextVal-- }
    }
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
// { done: true }
