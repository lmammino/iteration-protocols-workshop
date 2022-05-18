import glob from 'glob'

const matcher = glob('**/*.js')
matcher.on('match', console.log)
matcher.on('end', () => console.log('All completed!'))
