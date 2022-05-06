const medallists = {
  'Teddy Riner': 33,
  'Driulis Gonzalez Morales': 16,
  'Ryoko Tani': 16,
  'Ilias Iliadis': 15
}

// ⚠️ This will fail: medallist is not iterable!
for (const [judoka, medals] of medallists) {
  console.log(`${judoka} has won ${medals} medals`)
}