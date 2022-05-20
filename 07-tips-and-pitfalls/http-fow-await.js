import { createServer } from 'http'
import { on } from 'events'

const server = createServer()
server.listen(8000)

// eslint-disable-next-line no-unused-vars
for await (const [req, res] of on(server, 'request')) {
  res.end('hello dear friend')
}
