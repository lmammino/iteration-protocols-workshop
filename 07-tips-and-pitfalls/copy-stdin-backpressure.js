import { createWriteStream } from 'fs'

const dest = createWriteStream('data.bin')

let bytes = 0
for await (const chunk of process.stdin) {
  dest.write(chunk)
  bytes += chunk.length
}
dest.end()

console.log(`${bytes} written into data.bin`)
