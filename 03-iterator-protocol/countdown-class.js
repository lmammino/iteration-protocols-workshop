class Countdown {
  constructor (start) {
    this.nextVal = start
  }

  next () {
    if (this.nextVal < 0) {
      return { done: true }
    }
    return {
      done: false,
      value: this.nextVal--
    }
  }
}

const countdown = new Countdown(3)
console.log(countdown.next()) // { done: false, value: 3 }
console.log(countdown.next()) // { done: false, value: 2 }
console.log(countdown.next()) // { done: false, value: 1 }
console.log(countdown.next()) // { done: false, value: 0 }
console.log(countdown.next()) // { done: true }
