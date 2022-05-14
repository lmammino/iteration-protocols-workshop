let bytes = 0
// process.stdin is a Readable stream!
process.stdin.on('data', (chunk) => {
  bytes += chunk.length
})
process.stdin.on('end', () => {
  console.log(`${bytes} bytes read from stdin`)
})
