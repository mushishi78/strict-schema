import { isInNumberRange } from '../lib/number-range'
import { ContantTypes, ConstantClaim, NumberRangeClaim, IntegerClaim, StringRangeClaim, BooleanClaim } from './claims'
import { valid, notConstant, unexpectedTypeOf, notInNumberRange, notInteger, notInStringRange } from './validation'

export function validateConstant<Constant extends ContantTypes>({ constant }: ConstantClaim<Constant>, value: unknown) {
  return Object.is(value, constant) ? valid : notConstant(constant, value)
}

export function validateNumberRange(claim: NumberRangeClaim, value: unknown) {
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)
  return isInNumberRange(claim.numberRange, value) ? valid : notInNumberRange(claim.numberRange, value)
}

export function validateInteger(_: IntegerClaim, value: unknown) {
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)
  return Number.isInteger(value) ? valid : notInteger(value)
}

export function validateStringRange(claim: StringRangeClaim, value: unknown) {
  if (typeof value !== 'string') return unexpectedTypeOf('string', value)
  const [min, max] = claim.stringRange
  return min <= value.length && max >= value.length ? valid : notInStringRange(claim.stringRange, value)
}

export function validateBoolean(_: BooleanClaim, value: unknown) {
  return typeof value === 'boolean' ? valid : unexpectedTypeOf('boolean', value)
}
