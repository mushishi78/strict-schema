import { isInNumberRange } from '../lib/number-range'
import { TypeError } from '../lib/type-helpers'

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
  TupleClaim,
  isTupleClaim,
  FieldsClaim,
  BrandClaim,
  InstanceOfClaim,
  AndClaim,
  OrClaim,
  NotClaim,
} from './claims'

import {
  valid,
  notConstant,
  unexpectedTypeOf,
  notInNumberRange,
  notInteger,
  notInStringRange,
  indexedValidations,
  Valid,
  NotConstant,
  UnexpectedTypeOf,
  NotInNumberRange,
  NotInteger,
  NotInStringRange,
  IndexedValidations,
  Validation,
  UnexpectedLength,
  unexpectedLength,
  isValid,
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
  [C] extends [TupleClaim<infer NestedClaims>] ? TupleValidation<NestedClaims, RL> :
  [C] extends [FieldsClaim<any>] ? Valid : // TODO
  [C] extends [BrandClaim<any>] ? Valid : // TODO
  [C] extends [InstanceOfClaim<any>] ? Valid : // TODO
  [C] extends [AndClaim<any>] ? Valid : // TODO
  [C] extends [OrClaim<any>] ? Valid : // TODO
  [C] extends [NotClaim<any>] ? Valid : // TODO
  TypeError<['ClaimValidation', 'unrecognized claim', C]>

export type IndexedClaimValidation<C extends IndexedClaim, RL extends ReferenceLookup> = ClaimValidation<_ClaimForIndexedClaim<C, RL>, RL>

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
  | (IndexedClaimValidation<C, RL> extends infer V ? [V] extends [Validation] ? IndexedValidations<V[]> : V : never)

export type TupleValidation<Cs extends IndexedClaim[], RL extends ReferenceLookup> =
  | Valid
  | UnexpectedTypeOf
  | UnexpectedLength
  | IndexedValidations<_ValidationForTupleClaims<Cs, RL>>

type _ValidationForTupleClaims<Cs extends IndexedClaim[], RL extends ReferenceLookup> =
  Cs extends [infer C, ...infer Rest] ? C extends IndexedClaim ? Rest extends IndexedClaim[] ?
  [IndexedClaimValidation<C, RL>, ..._ValidationForTupleClaims<Rest, RL>] :
  [] : [] : []

export function validateClaim<C extends Claim, RL extends ReferenceLookup>(claim: C, value: unknown, referenceLookup: RL): ClaimValidation<C, RL> {
  if (isConstantClaim(claim)) return validateConstant(claim, value) as ClaimValidation<C, RL>
  if (isNumberRangeClaim(claim)) return validateNumberRange(claim, value) as ClaimValidation<C, RL>
  if (isIntegerClaim(claim)) return validateInteger(claim, value) as ClaimValidation<C, RL>
  if (isStringRangeClaim(claim)) return validateStringRange(claim, value) as ClaimValidation<C, RL>
  if (isBooleanClaim(claim)) return validateBoolean(claim, value) as ClaimValidation<C, RL>
  if (isArrayClaim(claim)) return validateArray(claim, value, referenceLookup) as ClaimValidation<C, RL>
  if (isTupleClaim(claim)) return validateTuple(claim, value, referenceLookup) as ClaimValidation<C, RL>
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

  type Vs = _ValidationForTupleClaims<NC[], RL>
  const validations = value.map((v, i) => validateIndexedClaim(claim.array, v, referenceLookup) as Vs[typeof i])
  return validations.every(isValid) ? valid : indexedValidations(...validations) as ArrayValidation<NC, RL>
}

export function validateTuple<NCs extends IndexedClaim[], RL extends ReferenceLookup>(claim: TupleClaim<NCs>, values: unknown, referenceLookup: RL): TupleValidation<NCs, RL> {
  if (!Array.isArray(values)) return unexpectedTypeOf('array', values)
  if (values.length !== claim.tuple.length) return unexpectedLength(claim.tuple.length, values)

  type Vs = _ValidationForTupleClaims<NCs, RL>
  const validations = [] as Vs

  values.forEach((v, i) => {
    validations[i] = validateIndexedClaim(claim.tuple[i], v, referenceLookup) as Vs[typeof i]
  })

  return validations.every(isValid) ? valid : indexedValidations(...validations)
}
