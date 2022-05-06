const judoInfo = {
  creator: 'Jigoro Kano',
  creationYear: 1882
}

const ranks = {
  belts: ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black', 'red-white', 'red'],
  dan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

const judo = { ...judoInfo, ...ranks }

console.log(judo)
