/*

  Run the tests with:

  > npm run ex -- 04-iterable-protocol/exercises/entries.test.js

*/

export function * entriesIterable (obj) {
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]]
  }
}
