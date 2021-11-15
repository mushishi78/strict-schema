import { areNumbersEqual } from '../lib/number'
import { isInNumberRange, NumberRange } from '../lib/number-range'
import { NumberSchema } from '../schema/number-schema'
import { allowIncludes, collectFailures } from './validate-helpers'
import { notAllowed, unexpectedTypeOf, valid, Validation } from './validation'

export interface ExpectedInteger extends Validation<'ExpectedInteger'> {
  value: number
}
export const expectedInteger = (value: number): ExpectedInteger => ({
  validationType: 'ExpectedInteger',
  value,
})

export function validateNumber(schema: NumberSchema, value: unknown) {
  const { allow, mustBeInteger } = schema.properties

  if (value == null) return allowIncludes(allow, value)
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)

  return collectFailures(
    mustBeInteger && !Number.isInteger(value) ? expectedInteger(value) : valid,
    isIn(allow, value) ? valid : notAllowed(allow, value)
  )
}

function isIn(list: Array<number | NumberRange | null | undefined>, num: number) {
  for (const member of list) {
    if (member == null) continue

    if (typeof member === 'number') {
      if (areNumbersEqual(member, num)) return true
    } else {
      if (isInNumberRange(member, num)) return true
    }
  }

  return false
}
