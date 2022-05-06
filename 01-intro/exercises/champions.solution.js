/**
 * @param {Object.<string, {gold: number, silver: number, bronze: number}>} athletes
 * @returns {[string]}
 */
export default function champions (athletes) {
  const wonAtLeast3Medals = []
  // Using for...of in combination with Object.entries to iterate over all the key-value pairs
  for (const [athlete, medals] of Object.entries(athletes)) {
    // Using reduce as a shortcut. Could have used another for...of and Object.values
    const countMedals = Object.values(medals).reduce((acc, curr) => acc + curr)
    if (countMedals >= 3) {
      wonAtLeast3Medals.push(athlete)
    }
  }
  return wonAtLeast3Medals
}
