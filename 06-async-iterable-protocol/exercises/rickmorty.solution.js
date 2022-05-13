import axios from 'axios'

export default function createCharactersPaginator () {
  let nextPage = 'https://rickandmortyapi.com/api/character'
  return {
    [Symbol.asyncIterator] () {
      return {
        async next () {
          if (nextPage === null) {
            return { done: true, value: undefined }
          }

          const resp = await axios.get(nextPage)
          nextPage = resp.data.info.next

          const pageData = resp.data.results.map((char) => char.name)
          return { done: false, value: pageData }
        }
      }
    }
  }
}

// const paginator = createCharactersPaginator()
// for await (const page of paginator) {
//   console.log(page)
// }
