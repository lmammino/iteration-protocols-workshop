class Countdown {
  constructor (start) {
    this.nextVal = start
  }

  // iterator protocol
  next () {
    if (this.nextVal < 0) {
      return { done: true }
    }
    return {
      done: false,
      value: this.nextVal--
    }
  }

  // iterable protocol
  [Symbol.iterator] () {
    return this
  }
}

const countdown = new Countdown(3)

console.log(countdown.next()) // { done: false, value: 3 }

for (const value of countdown) {
  console.log(value)
}

// 2
// 1
// 0

console.log(countdown.next()) // { done: true }
