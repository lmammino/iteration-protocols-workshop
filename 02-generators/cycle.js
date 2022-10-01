function * cycle (values) {
  let current = 0
  while (true) {
    yield values[current]
    current = (current + 1) % values.length
  }
}

for (const value of cycle(['even', 'odd'])) {
  console.log(value)
}
