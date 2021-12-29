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

type ReferenceLookup = Record<string, Claim>

// prettier-ignore
export type ClaimValidation<C extends Claim, RL extends ReferenceLookup> =
  [C] extends [ConstantClaim<infer Const>] ? ConstantValidation<Const> :
  [C] extends [NumberRangeClaim] ? NumberRangeValidation :
  [C] extends [IntegerClaim] ? IntegerValidation :
  [C] extends [StringRangeClaim] ? StringRangeValidation :
  [C] extends [BooleanClaim] ? BooleanValidation :
  [C] extends [ArrayClaim<infer NestedClaim>] ? ArrayValidation<NestedClaim, RL> :
  { error: ['ClaimValidation', 'unrecognized claim', C] }

export type IndexedClaimValidation<C extends IndexedClaim, RL extends ReferenceLookup> = ClaimValidation<_ClaimForIndexedClaim<C, RL>, RL>

// prettier-ignore
type _ClaimValidation<C extends Claim, RL extends ReferenceLookup> =
  [ClaimValidation<C, RL>] extends [infer V] ? V extends Validation ?
  V : never : never

type _JustFailures<V extends Validation> = Exclude<V, Valid>

type _ClaimForIndexedClaim<C extends IndexedClaim, RL extends ReferenceLookup> =
  [C] extends [IndexedReference<infer Ref>] ? RL[Ref] :
  [C] extends [Claim] ? C :
  never

export type ConstantValidation<Constant extends ContantTypes> = Valid | NotConstant<Constant>
export type NumberRangeValidation = Valid | UnexpectedTypeOf | NotInNumberRange
export type IntegerValidation = Valid | UnexpectedTypeOf | NotInteger
export type StringRangeValidation = Valid | UnexpectedTypeOf | NotInStringRange
export type BooleanValidation = Valid | UnexpectedTypeOf

export type ArrayValidation<C extends IndexedClaim, RL extends ReferenceLookup> =
  | Valid
  | UnexpectedTypeOf
  | IndexedFailures<_JustFailures<_ClaimValidation<_ClaimForIndexedClaim<C, RL>, RL>>>

export function validateClaim<C extends Claim, RL extends ReferenceLookup>(claim: C, value: unknown, referenceLookup: RL): ClaimValidation<C, RL> {
  if (isConstantClaim(claim)) return validateConstant(claim, value) as ClaimValidation<C, RL>
  if (isNumberRangeClaim(claim)) return validateNumberRange(claim, value) as ClaimValidation<C, RL>
  if (isIntegerClaim(claim)) return validateInteger(claim, value) as ClaimValidation<C, RL>
  if (isStringRangeClaim(claim)) return validateStringRange(claim, value) as ClaimValidation<C, RL>
  if (isBooleanClaim(claim)) return validateBoolean(claim, value) as ClaimValidation<C, RL>
  if (isArrayClaim(claim)) return validateArray(claim, value, referenceLookup) as ClaimValidation<C, RL>
  throw new Error(`Unrecognied claim: ${claim}`)
}

function lookupReference<RL extends ReferenceLookup, K extends keyof RL>(referenceLookup: RL, key: K): RL[K] {
  const claim = referenceLookup[key]
  if (claim != null) return claim
  throw new Error(`Missing reference lookup: ${key} in ${referenceLookup}`)
}

function validateIndexedClaim<C extends IndexedClaim, RL extends ReferenceLookup>(claim: C, value: unknown, referenceLookup: RL): IndexedClaimValidation<C, RL> {
  const claimToUse =
    isIndexedReference(claim)
      ? lookupReference(referenceLookup, claim.indexedReference) as _ClaimForIndexedClaim<C, RL>
      : claim as _ClaimForIndexedClaim<C, RL>

  return validateClaim(claimToUse, value, referenceLookup)
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

export function validateArray<NC extends IndexedClaim, RL extends ReferenceLookup>(claim: ArrayClaim<NC>, value: unknown, referenceLookup: RL): ArrayValidation<NC, RL> {
  if (!Array.isArray(value)) return unexpectedTypeOf('array', value)

  type V = IndexedClaimValidation<NC, RL>
  type F = V extends Failure ? V : never
  const failures: Array<FailureAtIndex<F>> = []

  for (let i = 0; i < value.length; i++) {
    const result: V = validateIndexedClaim(claim.array, value[i], referenceLookup)
    if ('error' in result) continue
    if (result.validationType === 'Valid') continue
    failures.push(failureAtIndex(i, result as F))
  }

  return failures.length === 0 ? valid : indexedFailures(failures) as ArrayValidation<NC, RL>
}
