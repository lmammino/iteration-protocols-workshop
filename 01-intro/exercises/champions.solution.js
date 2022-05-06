/**
 * @param {Object.<string, {gold: number, silver: number, bronze: number}>} athletes
 * @returns {[string]}
 */
export default function champions (athletes) {
  const wonAtLeast3Medals = []
  for (const [athlete, medals] of Object.entries(athletes)) {
    const countMedals = Object.values(medals).reduce((acc, curr) => acc + curr)
    if (countMedals >= 3) {
      wonAtLeast3Medals.push(athlete)
    }
  }
  return wonAtLeast3Medals
}
