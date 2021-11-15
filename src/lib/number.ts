export function areNumbersEqual(a: number, b: number) {
  // If both are NaN, than count that as true
  if (Number.isNaN(a) && Number.isNaN(b)) return true

  return a === b
}
