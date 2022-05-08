function * countdownGen (start) {
  for (let i = start; i >= 0; i--) {
    yield i
  }
}

const countdown = countdownGen(3)
console.log(countdown.next()) // { done: false, value: 3 }
console.log(countdown.next()) // { done: false, value: 2 }
console.log(countdown.next()) // { done: false, value: 1 }
console.log(countdown.next()) // { done: false, value: 0 }
console.log(countdown.next()) // { done: true, value: undefined }
