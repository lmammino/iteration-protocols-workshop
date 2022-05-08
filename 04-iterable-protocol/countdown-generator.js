function * countdownGen (start) {
  for (let i = start; i >= 0; i--) {
    yield i
  }
}

const countdown = countdownGen(3)
for (const value of countdown) {
  console.log(value)
}
