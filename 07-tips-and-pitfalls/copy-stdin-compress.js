import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import { createBrotliCompress } from 'node:zlib'

class CountBytes extends Transform {
  constructor (options) {
    super(options)
    this.bytes = 0
  }

  _transform (chunk, _enc, done) {
    this.bytes += chunk.length
    this.push(chunk)
    done()
  }
}

const compress = createBrotliCompress()
const beforeCompression = new CountBytes()
const afterCompression = new CountBytes()
const destStream = createWriteStream('data.bin.br')

await pipeline(
  process.stdin,
  beforeCompression,
  compress,
  afterCompression,
  destStream
)

console.log(`Read ${beforeCompression.bytes} bytes and written ${afterCompression.bytes} bytes into "data.bin.br"`)
