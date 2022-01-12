import { assert, Equals } from 'tsafe'
import { BooleanValidation, ClaimValidation, IntegerValidation, validateClaim } from './validate'
import {
  array,
  boolean,
  constant,
  field,
  fieldReference,
  fields,
  indexedReference,
  integer,
  numberRange,
  stringRange,
  tuple,
} from './claims'

import {
  Valid,
  NotConstant,
  NotInteger,
  NotInNumberRange,
  UnexpectedTypeOf,
  NotInStringRange,
  IndexedValidations,
  UnexpectedLength,
  isValid,
  KeyedValidations,
  Missing,
} from './validation'

{
  const claim = constant(256)
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | NotConstant<256>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = numberRange([34, '< n <', 100])
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | NotInNumberRange
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | NotInteger
  assert<Equals<Actual, Expected>>()
}
{
  const claim = stringRange([0, 10])
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | NotInStringRange
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(constant(256))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | IndexedValidations<(Valid | NotConstant<256>)[]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(array(integer))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | IndexedValidations<(Valid | UnexpectedTypeOf | IndexedValidations<(Valid | UnexpectedTypeOf | NotInteger)[]>)[]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(indexedReference('num'))
  type Actual = ClaimValidation<typeof claim, { num: 'Integer' }>
  type Expected = Valid | UnexpectedTypeOf | IndexedValidations<(Valid | UnexpectedTypeOf | NotInteger)[]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(constant(256))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected = Valid | UnexpectedTypeOf | UnexpectedLength | IndexedValidations<[Valid | NotConstant<256>]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(constant(256), integer)
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<[Valid | NotConstant<256>, Valid | UnexpectedTypeOf | NotInteger]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(tuple(integer))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<
        [Valid | UnexpectedTypeOf | UnexpectedLength | IndexedValidations<[Valid | UnexpectedTypeOf | NotInteger]>]
      >
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(indexedReference('num'))
  type Actual = ClaimValidation<typeof claim, { num: 'Integer' }>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<[Valid | UnexpectedTypeOf | NotInteger]>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(constant(0), indexedReference('num'))
  type Actual = ClaimValidation<typeof claim, { num: 'Integer' }>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | UnexpectedLength
    | IndexedValidations<[Valid | NotConstant<0>, Valid | UnexpectedTypeOf | NotInteger]>
  assert<Equals<Actual, Expected>>()
}
{
  const validation = validateClaim(tuple(boolean, integer), [true, 34], {})
  if (validation.validationType === 'IndexedValidations') {
    const [v0, v1] = validation.validations
    if (!isValid(v0)) {
      assert<Equals<typeof v0, UnexpectedTypeOf>>()
    }
    if (!isValid(v1)) {
      assert<Equals<typeof v1, UnexpectedTypeOf | NotInteger>>()
    }
  }
}
{
  const claim = fields(field('a', integer), field('b', boolean))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation | Missing } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(fieldReference('a', 'num'), field('b', boolean))
  const lookup = { num: integer }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation | Missing } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a?', integer), field('b', boolean))
  type Actual = ClaimValidation<typeof claim, {}>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(fieldReference('a?', 'num'), field('b', boolean))
  const lookup = { num: integer }
  type Actual = ClaimValidation<typeof claim, typeof lookup>
  type Expected =
    | Valid
    | UnexpectedTypeOf
    | KeyedValidations<{ a: IntegerValidation } & { b: BooleanValidation | Missing }>
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a?', integer), field('b', boolean))
  const validation = validateClaim(claim, { a: 234.5 }, {})
  if (validation.validationType === 'KeyedValidations') {
    const { a, b } = validation.validations
    if (!isValid(a)) {
      assert<Equals<typeof a, UnexpectedTypeOf | NotInteger>>()
    }
    if (!isValid(b)) {
      assert<Equals<typeof b, UnexpectedTypeOf | Missing>>()
    }
  }
}
