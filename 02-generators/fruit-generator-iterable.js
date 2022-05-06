function * fruitGenerator () {
  yield '🍑'
  yield '🍉'
  yield '🍋'
  yield '🥭'
}

const fruitGeneratorObj = fruitGenerator()
for (const fruit of fruitGeneratorObj) {
  console.log(fruit)
}
