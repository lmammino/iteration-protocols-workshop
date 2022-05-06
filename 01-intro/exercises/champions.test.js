import tap from 'tap'
import athletes from './data/athletes.js'

import championsSolution from './champions.solution.js'
import championsTpl from './champions.js'

const champions = process.env.TEST_SOLUTIONS ? championsSolution : championsTpl

tap.test('matches expected champions', async function (t) {
  const result = champions(athletes)
  t.same(result, [
    'Tadahiro Nomura',
    'Rishod Sobirov',
    'Lasha Shavdatuashvili',
    'Mark Huizinga',
    'Angelo Parisi',
    'David Douillet',
    'Teddy Riner',
    'Ryoko Tamura',
    'Amarilis Savón',
    'Kye Sun-hui',
    'Driulis González',
    'Edith Bosch',
    'Mayra Aguiar',
    'Idalys Ortiz'
  ])
})
