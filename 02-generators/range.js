function * range (start, end) {
  for (let i = start; i < end; i++) {
    yield i
  }
}

for (const i of range(0, 11)) {
  console.log(i)
}
