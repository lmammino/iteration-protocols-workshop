/*
  Exercise
  Let's implement an iterable over all the emojis of a given text.

  This iterator should behave as follows:

  - If you create the iterable with the `text`: "Hello 👋 World 🌎"
  - You should be able to do a `for ... of` loop over the iterable and get '👋'
    for the first iteration and '🌎' for the second.

  Try to implement this iterable using 3 different styles:

  - With a factory function
  - With a class
  - With a generator

  TIPS:

  - You can convert a string into an array of unicode characters with `Array.from(str)`
  - If you use a `for ... of` over a string, every element will be a unicode character
  - A simple way to test if a given unicode character is an emoji is: `char.match(/\p{Emoji}/u) !== null`
*/

export function createEmojiIter (text) {
  // write your code here
}

export class EmojiIter {
  constructor (text) {
    this.chars = Array.from(text)
    // write your code here
  }

  next () {
    // write your code here
  }
}

export function * emojiIterGen (text) {
  // write your code here
}
