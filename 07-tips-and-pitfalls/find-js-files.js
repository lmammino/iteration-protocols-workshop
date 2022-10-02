import { on } from 'node:events'
import glob from 'glob'

const matcher = glob('**/*.js')

for await (const [filePath] of on(matcher, 'match')) {
  console.log(filePath)
}
