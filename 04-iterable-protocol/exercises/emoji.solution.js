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
    },

    // Note: this is the only addition from the previous chapter
    // This makes it both an iterator and an iterable
    [Symbol.iterator] () {
      return this
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

  // Note: this is the only addition from the previous chapter
  // This makes it both an iterator and an iterable
  [Symbol.iterator] () {
    return this
  }
}

// Note: this one doesn't need to change.
// Generator functions create objects that are both iterable and iterator.
export function * emojiIterGen (text) {
  for (const char of text) {
    if (char.match(/\p{Emoji}/u) !== null) {
      yield char
    }
  }
}
