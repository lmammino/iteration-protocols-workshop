import { setTimeout } from 'timers/promises'

async function * createAsyncCountdown (start, delay = 1000) {
  for (let i = start; i >= 0; i--) {
    await setTimeout(delay)
    yield i
  }
}

const countdown = createAsyncCountdown(3)

console.log(await countdown.next()) // { value: 3, done: false }

for await (const value of countdown) {
  console.log(value) // 2 ... 1 ... 0
}
