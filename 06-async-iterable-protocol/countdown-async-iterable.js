import { setTimeout } from 'node:timers/promises'

function createAsyncCountdown (start, delay = 1000) {
  let nextVal = start
  return {
    [Symbol.asyncIterator]: function () {
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
  }
}

const countdown = createAsyncCountdown(3)

for await (const value of countdown) {
  console.log(value) // 3 ... 2 ... 1 ... 0
}
