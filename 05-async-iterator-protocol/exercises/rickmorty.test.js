import tap from 'tap'
import nock from 'nock'

import rickmortydata from './__mocks__/rickmortydata.js'
import createCharactersPaginatorSolution from './rickmorty.solution.js'
import createCharactersPaginatorTpl from './rickmorty.js'

const createCharactersPaginator = process.env.TEST_SOLUTIONS ? createCharactersPaginatorSolution : createCharactersPaginatorTpl

tap.test('createCharactersPaginator', async function (t) {
  const scope = nock('https://rickandmortyapi.com')

  const expected = []

  for (let i = 0; i < rickmortydata.length; i++) {
    const pageNum = i + 1
    const page = rickmortydata[i]
    scope.get(`/api/character${pageNum > 1 ? `?page=${pageNum}` : ''}`)
      .reply(200, page)

    expected.push(page.results.map(c => c.name))
  }

  const iter = createCharactersPaginator()
  const received = []

  let resp = await iter.next()
  while (!resp.done) {
    received.push(resp.value)
    resp = await iter.next()
  }

  console.log(received, received.reduce((acc, curr) => { acc += curr.length; return acc }, 0))
  console.log(scope)

  t.same(received, expected, 'Results match')
  t.ok(scope.isDone, 'Called all the pages')
})
