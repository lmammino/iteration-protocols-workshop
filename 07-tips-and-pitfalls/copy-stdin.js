import { createWriteStream } from 'node:fs'
import { once } from 'node:events'

const dest = createWriteStream('data.bin')

let bytes = 0
for await (const chunk of process.stdin) {
  const canContinue = dest.write(chunk)
  bytes += chunk.length
  if (!canContinue) {
    // backpressure, now we stop and we need to wait for drain
    await once(dest, 'drain')
    // ok now it's safe to resume writing
  }
}
dest.end()

console.log(`${bytes} written into data.bin`)
