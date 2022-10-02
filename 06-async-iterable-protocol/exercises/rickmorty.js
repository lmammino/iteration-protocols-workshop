/*
  Exercise
  Let's create a utility function to retrieve all the Rick and Morty characters!

  Yes, there's an API for that. Check out https://rickandmortyapi.com/

  We want to implement a `createCharactersPaginator` factory function that returns
  an iterable objects that can be used to go through all of the pages.
  Every page contains multiple characters.

  You can get the first page by calling:

  ```
  GET https://rickandmortyapi.com/api/character
  ```

  The iterator should emit values that look like this:

  ```json
  [
    "character1",
    "character2",
    "character3",
    ...
    "character20"
  ]
  ```

  An array with a maximum of 20 character names.

  You can use `axios`, `node-fetch` or `undici`, they are all already available in your `node_modules`!

  Run the tests with:

  npm run ex -- 06-async-iterable-protocol/exercises/rickmorty.test.js
*/

export default function createCharactersPaginator () {
  // return an iterator that returns pages of characters
}
