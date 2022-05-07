function * fruitGenerator () {
  yield '🍑'
  yield '🍉'
  yield '🍋'
  return '🥭'
}

const fruitGeneratorObj = fruitGenerator()
console.log(fruitGeneratorObj.next()) // { value: '🍑', done: false }
console.log(fruitGeneratorObj.next()) // { value: '🍉', done: false }
console.log(fruitGeneratorObj.next()) // { value: '🍋', done: false }
console.log(fruitGeneratorObj.next()) // { value: '🥭', done: true }
