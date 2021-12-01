import { isInNumberRange } from '../lib/number-range'
import { ContantTypes, ConstantClaim, NumberRangeClaim, IntegerClaim } from './claims'
import { valid, notConstant, unexpectedTypeOf, notInNumberRange, notInteger } from './validation'

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
