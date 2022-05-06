export default function fizzBuzz (limit) {
  const seq = []
  // using a simple for loop because we don't have items to iterate on
  for (let i = 1; i <= limit; i++) {
    const divBy3 = i % 3 === 0
    const divBy5 = i % 5 === 0

    if (divBy3 && divBy5) {
      seq.push('Fizz Buzz')
    } else if (divBy3) {
      seq.push('Fizz')
    } else if (divBy5) {
      seq.push('Buzz')
    } else {
      seq.push(i)
    }
  }
  return seq
}