function createCountdown (start) {
  let nextVal = start
  return {
    [Symbol.iterator]: () => ({
      next () {
        if (nextVal < 0) {
          return { done: true }
        }
        return {
          done: false,
          value: nextVal--
        }
      }
    })
  }
}

const countdown = createCountdown(3)
for (const value of countdown) {
  console.log(value)
}

// 3
// 2
// 1
// 0
