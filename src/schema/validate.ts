import { isInNumberRanges } from '../lib/number-range'
import { Constructor, isNever, TypeError } from '../lib/type-helpers'

import {
  ContantTypes,
  ConstantClaim,
  NumberClaim,
  IntegerClaim,
  StringClaim,
  BooleanClaim,
  ArrayClaim,
  Claim,
  isConstantClaim,
  isNumberClaim,
  isIntegerClaim,
  isBooleanClaim,
  isArrayClaim,
  isStringClaim,
  IndexedClaim,
  isIndexedReference,
  IndexedReference,
  TupleClaim,
  isTupleClaim,
  FieldsClaim,
  BrandClaim,
  InstanceOfClaim,
  OrClaim,
  Field,
  FieldReference,
  isFieldsClaim,
  UuidClaim,
  DateStringClaim,
  UnknownClaim,
  NeverClaim,
  RegularField,
  OptionalField,
  DiscriminantField,
  OptionalFieldReference,
  isRegularField,
  isOptionalField,
  isDiscriminantField,
  isFieldReference,
  isOptionalFieldReference,
  isInstanceOfClaim,
  isOrClaim,
} from './claims'

import {
  valid,
  notConstant,
  unexpectedTypeOf,
  notInNumberRanges,
  notInteger,
  notInStringRange,
  indexedValidations,
  Valid,
  NotConstant,
  UnexpectedTypeOf,
  NotInNumberRanges,
  NotInteger,
  NotInStringRange,
  IndexedValidations,
  Validation,
  UnexpectedLength,
  unexpectedLength,
  isValid,
  KeyedValidations,
  missing,
  keyedValidations,
  Missing,
  NotInstanceOf,
  notInstanceOf,
  DiscriminantInvalid,
  discriminantInvalid,
  UnionOfValidations,
  unionOfValidations,
} from './validation'

type ReferenceLookup = Record<string, Claim>

// prettier-ignore
export type ClaimValidation<C extends Claim, RL extends ReferenceLookup> =
  [C] extends [ConstantClaim<infer Const>] ? ConstantValidation<Const> :
  [C] extends [NumberClaim] ? NumberValidation :
  [C] extends [IntegerClaim] ? IntegerValidation :
  [C] extends [StringClaim] ? StringValidation :
  [C] extends [UuidClaim] ? Valid : // TODO
  [C] extends [DateStringClaim] ? Valid : // TODO
  [C] extends [BooleanClaim] ? BooleanValidation :
  [C] extends [UnknownClaim] ? Valid : // TODO
  [C] extends [NeverClaim] ? Valid : // TODO
  [C] extends [ArrayClaim<infer NestedClaim>] ? ArrayValidation<NestedClaim, RL> :
  [C] extends [TupleClaim<infer NestedClaims>] ? TupleValidation<NestedClaims, RL> :
  [C] extends [FieldsClaim<infer Fields>] ? FieldsValidation<Fields, RL> :
  [C] extends [BrandClaim<any, infer NestedClaim>] ? ClaimValidation<NestedClaim, RL> : // TODO
  [C] extends [InstanceOfClaim<infer C>] ? InstanceOfValidation<C> :
  [C] extends [OrClaim<infer NestedClaims>] ? OrValidation<NestedClaims, RL> : // TODO
  TypeError<['ClaimValidation', 'unrecognized claim', C]>

// prettier-ignore
export type IndexedClaimValidation<C extends IndexedClaim, RL extends ReferenceLookup> =
  ClaimValidation<_ClaimForIndexedClaim<C, RL>, RL>

// prettier-ignore
type _ClaimForIndexedClaim<C extends IndexedClaim, RL extends ReferenceLookup> =
  [C] extends [IndexedReference<infer Ref>] ? RL[Ref] :
  [C] extends [Claim] ? C :
  never

export type ConstantValidation<Constant extends ContantTypes> = Valid | NotConstant<Constant>
export type NumberValidation = Valid | UnexpectedTypeOf | NotInNumberRanges
export type IntegerValidation = Valid | UnexpectedTypeOf | NotInNumberRanges | NotInteger
export type StringValidation = Valid | UnexpectedTypeOf | NotInStringRange
export type BooleanValidation = Valid | UnexpectedTypeOf
export type InstanceOfValidation<C extends Constructor> = Valid | NotInstanceOf<C>

export type ArrayValidation<C extends IndexedClaim, RL extends ReferenceLookup> =
  | Valid
  | UnexpectedTypeOf
  | (IndexedClaimValidation<C, RL> extends infer V ? ([V] extends [Validation] ? IndexedValidations<V[]> : V) : never)

export type TupleValidation<Cs extends IndexedClaim[], RL extends ReferenceLookup> =
  | Valid
  | UnexpectedTypeOf
  | UnexpectedLength
  | IndexedValidations<_ValidationForTupleClaims<Cs, RL>>

// prettier-ignore
type _ValidationForTupleClaims<Cs extends IndexedClaim[], RL extends ReferenceLookup> =
  Cs extends [infer C, ...infer Rest] ? C extends IndexedClaim ? Rest extends IndexedClaim[] ?
    [IndexedClaimValidation<C, RL>, ..._ValidationForTupleClaims<Rest, RL>] : [] : [] :
  []

export type FieldsValidation<Fs extends Field[], RL extends ReferenceLookup> =
  | Valid
  | UnexpectedTypeOf
  | KeyedValidations<_ValidationForFieldClaims<Fs, RL>>
  | (true extends _HasDiscriminant<Fs> ? DiscriminantInvalid : never)

// prettier-ignore
type _ValidationForFieldClaims<Fs extends Field[], RL extends ReferenceLookup> =
  Fs extends [infer F, ...infer Rest] ? F extends Field ? Rest extends Field[] ?
    _ValidationForFieldClaim<F, RL> & _ValidationForFieldClaims<Rest, RL> : {} : {} :
  {}

// prettier-ignore
type _ValidationForFieldClaim<F extends Field, RL extends ReferenceLookup> =
  F extends RegularField<infer Key, infer Value> ? Value extends Claim ? { [k in Key]: ClaimValidation<Value, RL> | Missing } : never :
  F extends OptionalField<infer Key, infer Value> ? Value extends Claim ? { [k in Key]: ClaimValidation<Value, RL> } : never :
  F extends DiscriminantField<infer Key, infer Value> ? Value extends Claim ? { [k in Key]: ClaimValidation<Value, RL> | Missing } : never : // TODO
  F extends FieldReference<infer Key, infer Ref> ? { [k in Key]: ClaimValidation<RL[Ref], RL> | Missing } :
  F extends OptionalFieldReference<infer Key, infer Ref> ? { [k in Key]: ClaimValidation<RL[Ref], RL> } :
  never

// prettier-ignore
type _HasDiscriminant<Fs extends Field[]> =
  Fs extends [infer F, ...infer Rest] ?
    F extends DiscriminantField<any, any> ? true :
    Rest extends Field[] ? _HasDiscriminant<Rest> : false :
  false

export type OrValidation<Cs extends Claim[], RL extends ReferenceLookup> =
  | Valid
  | UnionOfValidations<_ValidationForOrClaims<Cs, RL>>

// prettier-ignore
type _ValidationForOrClaims<Cs extends Claim[], RL extends ReferenceLookup> =
  Cs extends [infer C, ...infer Rest] ? C extends Claim ? Rest extends Claim[] ?
    [ClaimValidation<C, RL>, ..._ValidationForTupleClaims<Rest, RL>] : [] : [] :
  []

export function validateClaim<C extends Claim, RL extends ReferenceLookup>(
  claim: C,
  value: unknown,
  referenceLookup: RL
): ClaimValidation<C, RL> {
  if (isConstantClaim(claim)) return validateConstant(claim, value) as ClaimValidation<C, RL>
  if (isNumberClaim(claim)) return validateNumber(claim, value) as ClaimValidation<C, RL>
  if (isIntegerClaim(claim)) return validateInteger(claim, value) as ClaimValidation<C, RL>
  if (isStringClaim(claim)) return validateString(claim, value) as ClaimValidation<C, RL>
  if (isBooleanClaim(claim)) return validateBoolean(claim, value) as ClaimValidation<C, RL>
  if (isArrayClaim(claim)) return validateArray(claim, value, referenceLookup) as ClaimValidation<C, RL>
  if (isTupleClaim(claim)) return validateTuple(claim, value, referenceLookup) as ClaimValidation<C, RL>
  if (isFieldsClaim(claim)) return validateFields(claim, value, referenceLookup) as ClaimValidation<C, RL>
  if (isInstanceOfClaim(claim)) return validateInstanceOf(claim, value) as ClaimValidation<C, RL>
  if (isOrClaim(claim)) return validateOr(claim, value, referenceLookup) as ClaimValidation<C, RL>
  throw new Error(`Unrecognied claim: ${claim}`)
}

function lookupReference<RL extends ReferenceLookup, K extends keyof RL>(referenceLookup: RL, key: K): RL[K] {
  const claim = referenceLookup[key]
  if (claim != null) return claim
  throw new Error(`Missing reference lookup: ${key} in ${referenceLookup}`)
}

function validateIndexedClaim<C extends IndexedClaim, RL extends ReferenceLookup>(
  claim: C,
  value: unknown,
  referenceLookup: RL
): IndexedClaimValidation<C, RL> {
  const claimToUse = isIndexedReference(claim)
    ? (lookupReference(referenceLookup, claim.indexedReference) as _ClaimForIndexedClaim<C, RL>)
    : (claim as _ClaimForIndexedClaim<C, RL>)

  return validateClaim(claimToUse, value, referenceLookup)
}

export function validateConstant<Constant extends ContantTypes>(
  { constant }: ConstantClaim<Constant>,
  value: unknown
): ConstantValidation<Constant> {
  return Object.is(value, constant) ? valid : notConstant(constant, value)
}

export function validateNumber(claim: NumberClaim, value: unknown): NumberValidation {
  const { ranges } = claim.number
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)
  if (ranges.length > 0 && !isInNumberRanges(ranges, value)) return notInNumberRanges(ranges, value)
  return valid
}

export function validateInteger(claim: IntegerClaim, value: unknown): IntegerValidation {
  const { ranges } = claim.integer
  if (typeof value !== 'number') return unexpectedTypeOf('number', value)
  if (ranges.length > 0 && !isInNumberRanges(ranges, value)) return notInNumberRanges(ranges, value)
  return Number.isInteger(value) ? valid : notInteger(value)
}

export function validateString(claim: StringClaim, value: unknown): StringValidation {
  if (typeof value !== 'string') return unexpectedTypeOf('string', value)
  const [min, max] = claim.string.range
  return min <= value.length && max >= value.length ? valid : notInStringRange(claim.string.range, value)
}

export function validateBoolean(_: BooleanClaim, value: unknown): BooleanValidation {
  return typeof value === 'boolean' ? valid : unexpectedTypeOf('boolean', value)
}

export function validateArray<NC extends IndexedClaim, RL extends ReferenceLookup>(
  claim: ArrayClaim<NC>,
  value: unknown,
  referenceLookup: RL
): ArrayValidation<NC, RL> {
  if (!Array.isArray(value)) return unexpectedTypeOf('array', value)

  type Vs = _ValidationForTupleClaims<NC[], RL>
  const validations = value.map((v, i) => validateIndexedClaim(claim.array, v, referenceLookup) as Vs[typeof i])
  return validations.every(isValid) ? valid : (indexedValidations(...validations) as ArrayValidation<NC, RL>)
}

export function validateTuple<NCs extends IndexedClaim[], RL extends ReferenceLookup>(
  claim: TupleClaim<NCs>,
  values: unknown,
  referenceLookup: RL
): TupleValidation<NCs, RL> {
  if (!Array.isArray(values)) return unexpectedTypeOf('array', values)
  if (values.length !== claim.tuple.length) return unexpectedLength(claim.tuple.length, values)

  type Vs = _ValidationForTupleClaims<NCs, RL>
  const validations = [] as Vs

  values.forEach((v, i) => {
    validations[i] = validateIndexedClaim(claim.tuple[i], v, referenceLookup) as Vs[typeof i]
  })

  return validations.every(isValid) ? valid : indexedValidations(...validations)
}

export function validateFields<Fields extends Field[], RL extends ReferenceLookup>(
  claim: FieldsClaim<Fields>,
  obj: unknown,
  referenceLookup: RL
): FieldsValidation<Fields, RL> {
  if (!isRecord(obj)) return unexpectedTypeOf('object', obj)

  // First check is discriminant's are valid
  for (const field of claim.fields) {
    if (!isFieldDiscriminant(field)) continue
    const key = getFieldKey(field)

    // If missing, then invalid by default
    if (!(key in obj)) return discriminantInvalid as FieldsValidation<Fields, RL>

    // Validate the discriminant claim
    const value = obj[key]
    const claim = getFieldClaim(field, referenceLookup)
    const validation = validateClaim(claim, value, referenceLookup)
    if (validation !== valid) return discriminantInvalid as FieldsValidation<Fields, RL>
  }

  // Then validate other fields

  type Vs = _ValidationForFieldClaims<Fields, RL>
  const validations = {} as Vs
  const expectedKeys: string[] = []
  let isValid = true

  for (const field of claim.fields) {
    if (isFieldDiscriminant(field)) continue

    const key = getFieldKey(field)

    expectedKeys.push(key)

    // If the expected key isn't there
    if (!(key in obj)) {
      const validation = isFieldOptional(field) ? valid : missing
      if (validation !== valid) isValid = false

      Object.assign(validations, { [key]: validation })
      continue
    }

    // Otherwise validate the claim for the field
    const value = obj[key]
    const claim = getFieldClaim(field, referenceLookup)
    const validation = validateClaim(claim, value, referenceLookup)
    if (validation !== valid) isValid = false

    Object.assign(validations, { [key]: validation })
  }

  // Collect all the unexpected keys in the object
  const unexpectedKeys = Object.keys(obj).filter((key) => !expectedKeys.includes(key))
  if (claim.exclusive && unexpectedKeys.length > 0) isValid = false

  // Return validation
  return isValid ? valid : keyedValidations(validations, unexpectedKeys)
}

function isRecord(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

function getFieldKey(field: Field): string {
  if (isRegularField(field)) return field.field.key
  if (isOptionalField(field)) return field.optionalField.key
  if (isDiscriminantField(field)) return field.discriminantField.key
  if (isFieldReference(field)) return field.fieldReference.key
  if (isOptionalFieldReference(field)) return field.optionalFieldReference.key
  throw isNever(field)
}

function isFieldOptional(field: Field): boolean {
  if (isRegularField(field)) return false
  if (isOptionalField(field)) return true
  if (isDiscriminantField(field)) return false
  if (isFieldReference(field)) return false
  if (isOptionalFieldReference(field)) return true
  throw isNever(field)
}

function isFieldDiscriminant(field: Field): boolean {
  if (isRegularField(field)) return false
  if (isOptionalField(field)) return false
  if (isDiscriminantField(field)) return true
  if (isFieldReference(field)) return false
  if (isOptionalFieldReference(field)) return false
  throw isNever(field)
}

function getFieldClaim<RL extends ReferenceLookup>(field: Field, referenceLookup: RL) {
  if (isRegularField(field)) return field.field.claim
  if (isOptionalField(field)) return field.optionalField.claim
  if (isDiscriminantField(field)) return field.discriminantField.claim
  if (isFieldReference(field)) return lookupReference(referenceLookup, field.fieldReference.referenceName)
  if (isOptionalFieldReference(field))
    return lookupReference(referenceLookup, field.optionalFieldReference.referenceName)
  throw isNever(field)
}

export function validateInstanceOf<C extends Constructor>(
  claim: InstanceOfClaim<C>,
  value: unknown
): InstanceOfValidation<C> {
  return value instanceof claim.instanceOf ? valid : notInstanceOf(claim.instanceOf)
}

export function validateOr<Cs extends Claim[], RL extends ReferenceLookup>(
  claim: OrClaim<Cs>,
  value: unknown,
  referenceLookup: RL
): OrValidation<Cs, RL> {
  type Vs = _ValidationForOrClaims<Cs, RL>
  const validations = [] as Vs

  claim.or.forEach((c, i) => {
    validations[i] = validateClaim(c, value, referenceLookup) as Vs[typeof i]
  })

  return validations.some(isValid) ? valid : unionOfValidations(...validations)
}
