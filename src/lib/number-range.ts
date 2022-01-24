import { isNever } from './type-helpers'

export type NumberRange =
  | [number, '< n <', number]
  | [number, '<= n <', number]
  | [number, '< n <=', number]
  | [number, '<= n <=', number]

export const positiveRange: NumberRange = [0, '<= n <', Infinity]
export const negativeRange: NumberRange = [-Infinity, '< n <=', 0]

export function isInNumberRange(range: NumberRange, number: number): boolean {
  const [lower, comparisonType, upper] = range

  switch (comparisonType) {
    case '< n <':
      return lower < number && number < upper
    case '<= n <':
      return lower <= number && number < upper
    case '< n <=':
      return lower < number && number <= upper
    case '<= n <=':
      return lower <= number && number <= upper
    default:
      isNever(comparisonType)
      return false
  }
}

export function isInNumberRanges(ranges: NumberRange[], number: number): boolean {
  return ranges.some((range) => isInNumberRange(range, number))
}
