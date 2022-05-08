function createCountdown (start) {
  let nextVal = start
  return {
    next () {
      if (nextVal < 0) {
        return { done: true }
      }
      return {
        done: false,
        value: nextVal--
      }
    }
  }
}

const countdown = createCountdown(3)
console.log(countdown.next()) // { done: false, value: 3 }
console.log(countdown.next()) // { done: false, value: 2 }
console.log(countdown.next()) // { done: false, value: 1 }
console.log(countdown.next()) // { done: false, value: 0 }
console.log(countdown.next()) // { done: true }
