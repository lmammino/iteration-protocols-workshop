const medallists = {
  'Teddy Riner': 33,
  'Driulis Gonzalez Morales': 16,
  'Ryoko Tani': 16,
  'Ilias Iliadis': 15
}

for (const judoka in medallists) {
  console.log(`${judoka} has won ${medallists[judoka]} medals`)
}