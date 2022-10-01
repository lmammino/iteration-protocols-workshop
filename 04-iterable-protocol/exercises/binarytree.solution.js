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
    if (node.left) yield * this.inOrderTraversal(node.left)
    yield node.value
    if (node.right) yield * this.inOrderTraversal(node.right)
  }

  [Symbol.iterator] () {
    return this.inOrderTraversal()
  }
}
