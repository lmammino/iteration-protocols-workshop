/*
  Exercise

  Complete the binary tree implementation and make it iterable.
  The given iterator should produce the values in the tree in order.

  Hint: you can rely on the provided `inOrderTraversal` function to get the
  items in order.

  Run the tests with:

  > npm run ex -- 04-iterable-protocol/exercises/binarytree.test.js
*/

class Node {
  constructor (value, left, right) {
    this.value = value
    this.left = left
    this.right = right
  }
}

export class BinaryTree {
  constructor () {
    this.root = null
  }

  insert (value) {
    const node = new Node(value)
    if (!this.root) {
      this.root = node
      return
    }

    let current = this.root
    while (current) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node
          break
        }
        current = current.left
      } else {
        if (!current.right) {
          current.right = node
          break
        }
        current = current.right
      }
    }
  }

  * inOrderTraversal (node = this.root) {
    // NOTE: yield* is a special syntax to delegate to another generator
    if (node.left) yield * this.inOrderTraversal(node.left)
    yield node.value
    if (node.right) yield * this.inOrderTraversal(node.right)
  }

  // What's missing here to make objects of this class iterable?!
}
