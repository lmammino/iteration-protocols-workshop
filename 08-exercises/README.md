# 07 - Exercises

In this last section you will find some ideas of small projects and exercises that you can build to practice your acquired knowledge of JavaScript iteration protocols.

## Exercises

For the following exercises you don't get a testing suite nor a solution, so be creative and have fun!

Feel free to share your solutions on GitHub and let me know on [Twitter](https://twitter.com/loige).


### 07.01 Lines iterator

Implement an iterable object that, given a text, will yield a line of that input text for every iteration.

For instance:

```js
const text = `I've got another confession to make
I'm your fool
Everyone's got their chains to break
Holding you`

const lines = linesIter(text)
lines.next() // { done: false, value: 'I\'ve got another confession to make' }
lines.next() // { done: false, value: 'I\'m your fool' }
lines.next() // { done: false, value: 'Everyone\'s got their chains to break' }
lines.next() // { done: false, value: 'Holding you' }
lines.next() // { done: true, value: undefined }
```


### 07.02 Incremental find

Create an iterable object that allows you to search an occurence of a certain keyword in a given text. The search should be lazy and give you one occurrence per every iteration. Every occurrence should be represented by the line number and the initial position of the match in that line (column index).

For instance if you have the follwing text:

```js
const text = `Were you born to resist or be abused
Is someone getting the best, the best, the best, the best of you
Is someone getting the best, the best, the best, the best of you`
```

We might want to search for the word `best` as follows:

```js
const finder = find(text, 'best')
finder.next() // { done: false, value: { line: 1, col: 24 } }
finder.next() // { done: false, value: { line: 1, col: 34 } }
finder.next() // { done: false, value: { line: 1, col: 44 } }
finder.next() // { done: false, value: { line: 1, col: 54 } }
finder.next() // { done: false, value: { line: 2, col: 24 } }
finder.next() // { done: false, value: { line: 2, col: 34 } }
finder.next() // { done: false, value: { line: 2, col: 44 } }
finder.next() // { done: false, value: { line: 2, col: 54 } }
finder.next() // { done: true, value: undefined }
```

Can you implement the `find` function to work as described in this example?


### 07.03 Enumerate utility 

TODO: enumerate utility
TODO: map utility
TODO: filter utility
TODO: fibonacci
TODO: batch utility
TODO: async iterator throttling


## Where to go from here

I hope you had fun with this workshop and that you also acquired some new practical learnings that you can bring to your next project.

If you want to keep learning about JavaScript, Node.js and iteration protocols, these are some interesting resources:

 - [Node.js Design Patterns, Third Edition](https://www.nodejsdesignpatterns.com/): has an entire section dedicated to iteration protocols and related design patterns (disclaimer: I co-authored this book!)
 - [JavaScript Async Iterator](https://www.nodejsdesignpatterns.com/blog/javascript-async-iterators/): An article that recaps most of the topics discussed in this workshop.
 - Learn [how I found a lost song using JavaScript and Async Iterators](https://youtu.be/uTzBHPpMEhA) (talk from No). You can also look at [the slides](https://loige.link/nodeconf-iter).
 - [Official (sync) Iteration protocols documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols): the goto place to make sure you didn't miss anything important about iteration protocols or just to quickly review something you don't remember.
 - [Official documentation about Async iterators and iterable on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator): Similar to the above but covers some details about the async counterparts of the iterator and iterable protocols.
 - [Official documentation about `for await ... of` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of): Gives you some more details about this syntax and when you can use it.

Let me know what you are going to build with your new acquired knowledge on [Twitter](https://twitter.com/loige), and you found this useful, please give it a star ⭐️ and share it with your friends and colleagues! ❤️

Thank you! 👋

---

| [⬅️ 07 - Tips and Pitfalls](/07-tips-and-pitfalls/README.md) | [🏠](/README.md)| - |
|:--------------|:------:|------------------------------------------------:|