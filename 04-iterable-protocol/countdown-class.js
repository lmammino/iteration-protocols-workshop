class Countdown {
  constructor (start) {
    this.start = start
  }

  [Symbol.iterator] () {
    let nextVal = this.start
    return ({
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

const countdown = new Countdown(3)

for (const value of countdown) {
  console.log(value)
}

// Note that Symbol.iterator gives us a new iterator each time, so we can do this again:
console.log('\n--- trying again ---\n')

for (const value of countdown) {
  console.log(value)
}

// 3
// 2
// 1
// 0
//
// --- trying again ---
//
// 3
// 2
// 1
// 0
