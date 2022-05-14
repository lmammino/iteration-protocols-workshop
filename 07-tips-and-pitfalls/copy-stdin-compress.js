import { Transform } from 'stream'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { createBrotliCompress } from 'zlib'

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
