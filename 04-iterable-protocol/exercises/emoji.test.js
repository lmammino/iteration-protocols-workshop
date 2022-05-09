import tap from 'tap'

import * as emojiSolution from './emoji.solution.js'
import * as emojiTpl from './emoji.js'

const solution = process.env.TEST_SOLUTIONS ? emojiSolution : emojiTpl

const text = 'the quick ⚡ brown 🟫 fox 🦊 jumps over 🔼 the lazy 💤 dog 🐶'
const expected = ['⚡', '🟫', '🦊', '🔼', '💤', '🐶']

tap.test('createEmojiIter', async function (t) {
  const iter = solution.createEmojiIter(text)
  const emojis = [...iter]
  t.same(emojis, expected)
})

tap.test('EmojiIter', async function (t) {
  const iter = new solution.EmojiIter(text)
  const emojis = [...iter]
  t.same(emojis, expected)
})

tap.test('emojiIterGen', async function (t) {
  const iter = solution.emojiIterGen(text)
  const emojis = [...iter]
  t.same(emojis, expected)
})
