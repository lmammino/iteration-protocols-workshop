import tap from 'tap'

import { BinaryTree as BinaryTreeSolution } from './binarytree.solution.js'
import { BinaryTree as BinaryTreeTpl } from './binarytree.js'

const BinaryTree = process.env.TEST_SOLUTIONS ? BinaryTreeSolution : BinaryTreeTpl

const values = [5, 3, 7, 2, 4, 6, 8, 1, 9]
const expected = [...values].sort()

tap.test('iterating over the binary tree give the numbers in order', async function (t) {
  const tree = new BinaryTree()
  for (const value of values) {
    tree.insert(value)
  }
  t.same([...tree], expected)
})
