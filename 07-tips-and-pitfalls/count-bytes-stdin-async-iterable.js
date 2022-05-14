let bytes = 0

for await (const chunk of process.stdin) {
  bytes += chunk.length
}

console.log(`${bytes} bytes read from stdin`)
