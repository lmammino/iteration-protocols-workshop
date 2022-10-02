import { on } from 'node:events'
import glob from 'glob'

const matcher = glob('**/*.js')
const ac = new global.AbortController()

matcher.once('end', () => ac.abort())

try {
  for await (const [filePath] of on(matcher, 'match', { signal: ac.signal })) {
    console.log(filePath)
  }
} catch (err) {
  if (!ac.signal.aborted) {
    console.error(err)
    process.exit(1)
  }
  // we ignore the AbortError
}

console.log('NOW WE ARE GETTING HERE! :)') // YAY! 😻
