import { createServer } from 'node:http'
import { on } from 'node:events'
import { setTimeout } from 'node:timers/promises'

const server = createServer()
server.listen(8000)

// eslint-disable-next-line no-unused-vars
for await (const [req, res] of on(server, 'request')) {
  (async function () {
    await setTimeout(1000)
    res.end('hello dear friend')
  })()
}
