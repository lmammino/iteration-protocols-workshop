const judokas = [
  'Driulis Gonzalez Morales',
  'Ilias Iliadis',
  'Tadahiro Nomura',
  'Anton Geesink',
  'Teddy Riner',
  'Ryoko Tani'
]

// ⚠️ Careful, this can be misleading!
// It's not going to print the judokas, but their index in the array!
for (const judoka in judokas) {
  console.log(judoka)
}
