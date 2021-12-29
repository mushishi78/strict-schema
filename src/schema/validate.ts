import { isInNumberRange } from '../lib/number-range'

import {
  ContantTypes,
  ConstantClaim,
  NumberRangeClaim,
  IntegerClaim,
  StringRangeClaim,
  BooleanClaim,
  ArrayClaim,
  Claim,
  isConstantClaim,
  isNumberRangeClaim,
  isIntegerClaim,
  isBooleanClaim,
  isArrayClaim,
  isStringRangeClaim,
  IndexedClaim,
  isIndexedReference,
  IndexedReference,
} from './claims'

import {
  valid,
  notConstant,
  unexpectedTypeOf,
  notInNumberRange,
  notInteger,
  notInStringRange,
  failureAtIndex,
  indexedFailures,
  Valid,
  NotConstant,
  UnexpectedTypeOf,
  NotInNumberRange,
  NotInteger,
  NotInStringRange,
  IndexedFailures,
  Failure,
  FailureAtIndex,
  Validation,
} from './validation'

// prettier-ignore
export type ClaimValidation<C extends Claim> =
  [C] extends [ConstantClaim<infer Const>] ? ConstantValidation<Const> :
  [C] extends [NumberRangeClaim] ? NumberRangeValidation :
  [C] extends [IntegerClaim] ? IntegerValidation :
  [C] extends [StringRangeClaim] ? StringRangeValidation :
  [C] extends [BooleanClaim] ? BooleanValidation :
  [C] extends [ArrayClaim<infer NestedClaim>] ? ArrayValidation<NestedClaim> : never

export type IndexedClaimValidation<C extends IndexedClaim> =
  [C] extends [IndexedReference<infer Ref>] ? { error: ['IndexedClaimValidation', 'Not implemented', C] } :
  [C] extends [Claim] ? ClaimValidation<C> :
  { error: ['IndexedClaimValidation', 'unrecognized claim', C] }

// prettier-ignore
type _ClaimValidation<C extends Claim> =
  [ClaimValidation<C>] extends [infer V] ? V extends Validation ?
  V : never : never

type _JustFailures<V extends Validation> = Exclude<V, Valid>

export type ConstantValidation<Constant extends ContantTypes> = Valid | NotConstant<Constant>
export type NumberRangeValidation = Valid | UnexpectedTypeOf | NotInNumberRange
export type IntegerValidation = Valid | UnexpectedTypeOf | NotInteger
export type StringRangeValidation = Valid | UnexpectedTypeOf | NotInStringRange
export type BooleanValidation = Valid | UnexpectedTypeOf

export type ArrayValidation<C extends IndexedClaim> =
  | Valid
  | UnexpectedTypeOf
  | (
    C extends Claim ? IndexedFailures<_JustFailures<_ClaimValidation<C>>> :
    C extends IndexedReference<infer Ref> ? { error: ['ArrayValidation', 'Not implemented', C] } :
    never
  )

export function validateClaim<C extends Claim>(claim: C, value: unknown): ClaimValidation<C> {
  if (isConstantClaim(claim)) return validateConstant(claim, value) as ClaimValidation<C>
  if (isNumberRangeClaim(claim)) return validateNumberRange(claim, value) as ClaimValidation<C>
  if (isIntegerClaim(claim)) return validateInteger(claim, value) as ClaimValidation<C>
  if (isStringRangeClaim(claim)) return validateStringRange(claim, value) as ClaimValidation<C>
  if (isBooleanClaim(claim)) return validateBoolean(claim, value) as ClaimValidation<C>
  if (isArrayClaim(claim)) return validateArray(claim, value) as ClaimValidation<C>
  throw new Error(`Unrecognied claim: ${claim}`)
}

function validateIndexedClaim<C extends IndexedClaim>(claim: C, value: unknown): IndexedClaimValidation<C> {
  if (isIndexedReference(claim)) throw new Error('Not implemented')
  return validateClaim(claim, value)
}

export function validateConstant<Constant extends ContantTypes>(
  { constant }: ConstantClaim<Constant>,
  value: unknown
): ConstantValidation<Constant> {
  return Object.is(value, constant) ? valid : notConstant(constant, value)
}

export function validateNumberRange(claim: NumberRangeClaim, value: unknown): NumberRangeValidation {
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)
  return isInNumberRange(claim.numberRange, value) ? valid : notInNumberRange(claim.numberRange, value)
}

export function validateInteger(_: IntegerClaim, value: unknown): IntegerValidation {
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)
  return Number.isInteger(value) ? valid : notInteger(value)
}

export function validateStringRange(claim: StringRangeClaim, value: unknown): StringRangeValidation {
  if (typeof value !== 'string') return unexpectedTypeOf('string', value)
  const [min, max] = claim.stringRange
  return min <= value.length && max >= value.length ? valid : notInStringRange(claim.stringRange, value)
}

export function validateBoolean(_: BooleanClaim, value: unknown): BooleanValidation {
  return typeof value === 'boolean' ? valid : unexpectedTypeOf('boolean', value)
}

export function validateArray<NC extends IndexedClaim>(claim: ArrayClaim<NC>, value: unknown): ArrayValidation<NC> {
  if (!Array.isArray(value)) return unexpectedTypeOf('array', value)

  type V = IndexedClaimValidation<NC>
  type F = V extends Failure ? V : never
  const failures: Array<FailureAtIndex<F>> = []

  for (let i = 0; i < value.length; i++) {
    const result: V = validateIndexedClaim(claim.array, value[i])
    if ('error' in result) continue
    if (result.validationType === 'Valid') continue
    failures.push(failureAtIndex(i, result as F))
  }

  return failures.length === 0 ? valid : indexedFailures(failures) as ArrayValidation<NC>
}
