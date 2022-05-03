const medallists = new Map([
  ['Teddy Riner', 33],
  ['Driulis Gonzalez Morales', 16],
  ['Ryoko Tani', 16],
  ['Ilias Iliadis', 15]
])

for (const [judoka, medals] of medallists) {
  console.log(`${judoka} has won ${medals} medals`)
}
