import { createServer } from 'node:http'
import { setTimeout } from 'node:timers/promises'

const server = createServer(async function (req, res) {
  await setTimeout(1000)
  res.end('hello dear friend')
})

server.listen(8000)
