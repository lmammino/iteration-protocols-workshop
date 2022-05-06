function * fruitGenerator () {
  yield '🍑'
  yield '🍉'
  yield '🍋'
  yield '🥭'
}

const fruitGeneratorObj = fruitGenerator()
console.log(fruitGeneratorObj.next()) // { value: '🍑', done: false }
console.log(fruitGeneratorObj.next()) // { value: '🍉', done: false }
console.log(fruitGeneratorObj.next()) // { value: '🍋', done: false }
console.log(fruitGeneratorObj.next()) // { value: '🥭', done: false }
console.log(fruitGeneratorObj.next()) // { value: undefined, done: true }
