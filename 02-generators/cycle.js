function * cycle (values) {
  let current = 0
  while (true) {
    yield values[current % values.length]
    current += 1
  }
}

for (const value of cycle(['even', 'odd'])) {
  console.log(value)
}
