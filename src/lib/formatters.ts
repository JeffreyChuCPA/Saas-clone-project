// To format given number. Compact means short form like 1000 -> 1k
const compactNumberFormatter = new Intl.NumberFormat(undefined, { notation: 'compact'})

export function formatCompactNumber(number: number) {
  return compactNumberFormatter.format(number)
}