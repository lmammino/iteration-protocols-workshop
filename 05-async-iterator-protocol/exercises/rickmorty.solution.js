import axios from 'axios'

export default function createCharactersPaginator () {
  let nextPage = 'https://rickandmortyapi.com/api/character'
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

// const paginator = createCharactersPaginator()
// console.log(await paginator.next())
// console.log(await paginator.next())
// console.log(await paginator.next())
