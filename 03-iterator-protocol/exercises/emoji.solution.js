export function createEmojiIter (text) {
  let index = 0
  const chars = Array.from(text)

  return {
    next () {
      while (index < chars.length) {
        const char = chars[index++]
        if (char.match(/\p{Emoji}/u) !== null) {
          return { done: false, value: char }
        }
      }

      return { done: true, value: undefined }
    }
  }
}

export class EmojiIter {
  constructor (text) {
    this.chars = Array.from(text)
    this.index = 0
  }

  next () {
    while (this.index < this.chars.length) {
      const char = this.chars[this.index++]
      if (char.match(/\p{Emoji}/u) !== null) {
        return { done: false, value: char }
      }
    }

    return { done: true, value: undefined }
  }
}

export function * emojiIterGen (text) {
  for (const char of text) {
    if (char.match(/\p{Emoji}/u) !== null) {
      yield char
    }
  }
}
