import test from 'ava'
import { ClaimValidation, validateClaim } from './validate'

import {
  array,
  boolean,
  brand,
  Claim,
  constant,
  discriminantField,
  exclusiveFields,
  field,
  fieldReference,
  fields,
  indexedReference,
  instanceOf,
  integer,
  number,
  optionalField,
  optionalFieldReference,
  or,
  string,
  tuple,
} from './claims'

import {
  valid,
  notConstant,
  unexpectedTypeOf,
  notInNumberRanges,
  notInteger,
  notInStringRange,
  indexedValidations,
  unexpectedLength,
  keyedValidations,
  missing,
  notInstanceOf,
  discriminantInvalid,
  unionOfValidations,
} from './validation'

function stringify(value: unknown) {
  return JSON.stringify(value, (k, v) => {
    if (Number.isNaN(v)) return 'NaN'
    if (v === Infinity) return 'Infinity'
    if (v === -Infinity) return '-Infinity'
    return v
  })
}

function testValidate<C extends Claim, RL extends Record<string, Claim>>(
  claim: C,
  value: unknown,
  referenceLookup: RL,
  expected: ClaimValidation<C, RL>
) {
  test(`validateClaim ${stringify(claim)} ${stringify(value)} ${stringify(referenceLookup)}`, (t) =>
    t.deepEqual(validateClaim(claim, value, referenceLookup), expected))
}

//
// constant

testValidate(constant(null), null, {}, valid)
testValidate(constant(undefined), undefined, {}, valid)
testValidate(constant(true), true, {}, valid)
testValidate(constant(false), false, {}, valid)
testValidate(constant(0), 0, {}, valid)
testValidate(constant(-1), -1, {}, valid)
testValidate(constant(1), 1, {}, valid)
testValidate(constant(''), '', {}, valid)
testValidate(constant('0'), '0', {}, valid)
testValidate(constant(NaN), NaN, {}, valid)
testValidate(constant(Infinity), Infinity, {}, valid)
testValidate(constant(-Infinity), -Infinity, {}, valid)

testValidate(constant(null), undefined, {}, notConstant(null, undefined))
testValidate(constant(undefined), null, {}, notConstant(undefined, null))
testValidate(constant(true), false, {}, notConstant(true, false))
testValidate(constant(false), true, {}, notConstant(false, true))
testValidate(constant(0), 1, {}, notConstant(0, 1))
testValidate(constant(-1), 1, {}, notConstant(-1, 1))
testValidate(constant(1), 0, {}, notConstant(1, 0))
testValidate(constant(''), ' ', {}, notConstant('', ' '))
testValidate(constant('0'), '1', {}, notConstant('0', '1'))
testValidate(constant(NaN), Infinity, {}, notConstant(NaN, Infinity))
testValidate(constant(Infinity), NaN, {}, notConstant(Infinity, NaN))
testValidate(constant(-Infinity), Infinity, {}, notConstant(-Infinity, Infinity))

//
// number

testValidate(number(), 1, {}, valid)
testValidate(number(), -1, {}, valid)
testValidate(number([0, '< n <', 5]), 1, {}, valid)
testValidate(number([0, '< n <', 5]), 3.5674, {}, valid)
testValidate(number([0, '< n <', 5]), 4.9, {}, valid)
testValidate(number([0, '<= n <=', 5]), 0, {}, valid)
testValidate(number([0, '<= n <=', 5]), 5, {}, valid)
testValidate(number([-Infinity, '<= n <=', Infinity]), -Infinity, {}, valid)
testValidate(number([-Infinity, '<= n <=', Infinity]), Infinity, {}, valid)
testValidate(number([0, '< n <', 5], [15, '< n <', 20]), 16, {}, valid)

testValidate(number(), 'hello', {}, unexpectedTypeOf('number', 'hello'))
testValidate(number(), '0', {}, unexpectedTypeOf('number', '0'))
testValidate(number(), null, {}, unexpectedTypeOf('number', null))
testValidate(number(), undefined, {}, unexpectedTypeOf('number', undefined))

testValidate(number([0, '< n <', 5]), 0, {}, notInNumberRanges([[0, '< n <', 5]], 0))
testValidate(number([0, '< n <', 5]), 5, {}, notInNumberRanges([[0, '< n <', 5]], 5))
testValidate(number([0, '<= n <=', 5]), -0.001, {}, notInNumberRanges([[0, '<= n <=', 5]], -0.001))
testValidate(number([0, '<= n <=', 5]), 5.1, {}, notInNumberRanges([[0, '<= n <=', 5]], 5.1))
testValidate(
  number([-Infinity, '< n <', Infinity]),
  -Infinity,
  {},
  notInNumberRanges([[-Infinity, '< n <', Infinity]], -Infinity)
)
testValidate(
  number([-Infinity, '< n <', Infinity]),
  Infinity,
  {},
  notInNumberRanges([[-Infinity, '< n <', Infinity]], Infinity)
)
testValidate(
  number([0, '< n <', 5], [10, '< n <', 15]),
  0,
  {},
  notInNumberRanges(
    [
      [0, '< n <', 5],
      [10, '< n <', 15],
    ],
    0
  )
)

//
// integer

testValidate(integer(), 1, {}, valid)
testValidate(integer(), -100, {}, valid)
testValidate(integer(), 1438384, {}, valid)

testValidate(integer(), 'hello', {}, unexpectedTypeOf('number', 'hello'))
testValidate(integer(), '0', {}, unexpectedTypeOf('number', '0'))
testValidate(integer(), null, {}, unexpectedTypeOf('number', null))
testValidate(integer(), undefined, {}, unexpectedTypeOf('number', undefined))

testValidate(integer(), 0.000001, {}, notInteger(0.000001))
testValidate(integer(), 0 / 0, {}, notInteger(0 / 0))
testValidate(integer(), Infinity, {}, notInteger(Infinity))

//
// string

testValidate(string(), '', {}, valid)
testValidate(string(), 'Heya', {}, valid)
testValidate(string(), 'Hello', {}, valid)
testValidate(string(0, 5), '', {}, valid)
testValidate(string(0, 5), 'Heya', {}, valid)
testValidate(string(0, 5), 'Hello', {}, valid)

testValidate(string(), 0, {}, unexpectedTypeOf('string', 0))
testValidate(string(), true, {}, unexpectedTypeOf('string', true))
testValidate(string(), null, {}, unexpectedTypeOf('string', null))
testValidate(string(), undefined, {}, unexpectedTypeOf('string', undefined))

testValidate(string(1, 4), '', {}, notInStringRange([1, 4], ''))
testValidate(string(1, 4), 'Hello', {}, notInStringRange([1, 4], 'Hello'))

//
// boolean

testValidate(boolean, true, {}, valid)
testValidate(boolean, false, {}, valid)

testValidate(boolean, 0, {}, unexpectedTypeOf('boolean', 0))
testValidate(boolean, 'true', {}, unexpectedTypeOf('boolean', 'true'))
testValidate(boolean, null, {}, unexpectedTypeOf('boolean', null))
testValidate(boolean, undefined, {}, unexpectedTypeOf('boolean', undefined))

//
// array

testValidate(array(integer()), [1, 2, 34, 56, 1, 2], {}, valid)
testValidate(
  array(array(integer())),
  [
    [1, 2],
    [34, 56, 1, 2],
  ],
  {},
  valid
)
testValidate(array(constant(0)), [0, 0, 0, 0], {}, valid)
testValidate(array(boolean), [true, true, false], {}, valid)

testValidate(array(integer()), 0, {}, unexpectedTypeOf('array', 0))
testValidate(array(integer()), 'true', {}, unexpectedTypeOf('array', 'true'))
testValidate(array(integer()), null, {}, unexpectedTypeOf('array', null))
testValidate(array(integer()), undefined, {}, unexpectedTypeOf('array', undefined))

testValidate(array(integer()), [1, 2, 34.67, 56], {}, indexedValidations(valid, valid, notInteger(34.67), valid))
testValidate(
  array(integer()),
  [1, '2', 34.67, 56],
  {},
  indexedValidations(valid, unexpectedTypeOf('number', '2'), notInteger(34.67), valid)
)
testValidate(
  array(array(integer())),
  [[1, 4], ['2']],
  {},
  indexedValidations(valid, indexedValidations(unexpectedTypeOf('number', '2')))
)

testValidate(array(indexedReference('num')), [1, 2, 34, 56, 1, 2], { num: integer() }, valid)
testValidate(array(indexedReference('num')), 0, { num: integer() }, unexpectedTypeOf('array', 0))
testValidate(
  array(indexedReference('num')),
  [1, 2, 34.67, 56],
  { num: integer() },
  indexedValidations(valid, valid, notInteger(34.67), valid)
)
test('validateClaim throws when an indexedReference is missing in array', (t) => {
  t.throws(() => validateClaim(array(indexedReference('missing')), [1, 2, 34, 56, 1, 2], {}))
})

//
// tuple

testValidate(tuple(integer()), [1], {}, valid)
testValidate(tuple(integer(), boolean), [1, false], {}, valid)
testValidate(tuple(tuple(integer(), boolean)), [[1, true]], {}, valid)
testValidate(tuple(constant(0), boolean), [0, false], {}, valid)
testValidate(tuple(integer(), boolean, constant(null)), [25, false, null], {}, valid)

testValidate(tuple(integer()), 0, {}, unexpectedTypeOf('array', 0))
testValidate(tuple(integer()), 'true', {}, unexpectedTypeOf('array', 'true'))
testValidate(tuple(integer()), null, {}, unexpectedTypeOf('array', null))
testValidate(tuple(integer()), undefined, {}, unexpectedTypeOf('array', undefined))

testValidate(tuple(integer()), [], {}, unexpectedLength(1, []))
testValidate(tuple(integer()), [1, 2], {}, unexpectedLength(1, [1, 2]))
testValidate(tuple(integer(), boolean, integer()), [1, false], {}, unexpectedLength(3, [1, false]))
testValidate(tuple(tuple(integer())), [[0], [1]], {}, unexpectedLength(1, [[0], [1]]))

testValidate(tuple(integer()), [0.23], {}, indexedValidations(notInteger(0.23)))
testValidate(
  tuple(integer(), boolean, integer()),
  [1, 1, 1],
  {},
  indexedValidations(valid, unexpectedTypeOf('boolean', 1), valid)
)
testValidate(
  tuple(tuple(integer()), tuple(boolean)),
  [[1], ['2']],
  {},
  indexedValidations(valid, indexedValidations(unexpectedTypeOf('boolean', '2')))
)

testValidate(tuple(indexedReference('num')), [1], { num: integer() }, valid)
testValidate(
  tuple(boolean, indexedReference('num')),
  [true, 0.23],
  { num: integer() },
  indexedValidations(valid, notInteger(0.23))
)
test('validateClaim throws when an indexedReference is missing in tuple', (t) => {
  t.throws(() => validateClaim(tuple(indexedReference('missing')), [1], {}))
})

//
// fields

testValidate(fields(field('a', integer())), { a: 23 }, {}, valid)
testValidate(fields(field('a', integer()), optionalField('b', boolean)), { a: 23 }, {}, valid)
testValidate(fields(field('a', integer()), optionalField('b', boolean)), { a: 23, b: false }, {}, valid)
testValidate(fields(fieldReference('a', 'n')), { a: true }, { n: boolean }, valid)
testValidate(fields(optionalFieldReference('a', 'n')), { a: true }, { n: boolean }, valid)
testValidate(fields(optionalFieldReference('a', 'n')), {}, { n: boolean }, valid)
testValidate(fields(field('a', integer())), { a: 23, b: 34 }, {}, valid)
testValidate(fields(field('a', integer())), { a: 23, b: { c: 'Hello' } }, {}, valid)

testValidate(fields(field('a', integer())), 23, {}, unexpectedTypeOf('object', 23))
testValidate(fields(field('a', integer())), [23], {}, unexpectedTypeOf('object', [23]))
testValidate(fields(field('a', integer())), [{ a: 23 }], {}, unexpectedTypeOf('object', [{ a: 23 }]))

testValidate(fields(field('a', integer())), { b: 23 }, {}, keyedValidations({ a: missing }, ['b']))
testValidate(
  fields(field('a', integer()), optionalField('b', boolean)),
  { b: false },
  {},
  keyedValidations({ a: missing, b: valid }, [])
)
testValidate(fields(fieldReference('a', 'n')), { b: 49 }, { n: boolean }, keyedValidations({ a: missing }, ['b']))

testValidate(exclusiveFields(field('a', integer())), { a: 23, b: 'void' }, {}, keyedValidations({ a: valid }, ['b']))

testValidate(fields(field('a', integer())), { a: 23.5 }, {}, keyedValidations({ a: notInteger(23.5) }, []))

testValidate(
  fields(fieldReference('a', 'n')),
  { a: 23.5 },
  { n: integer() },
  keyedValidations({ a: notInteger(23.5) }, [])
)
testValidate(fields(fieldReference('a', 'n')), { a: 23 }, { n: integer() }, valid)

testValidate(fields(discriminantField('type', constant('status'))), { type: 'stat' }, {}, discriminantInvalid)
testValidate(fields(discriminantField('type', constant('status'))), { typ: 'status' }, {}, discriminantInvalid)

// brand

type FileId = number & { readonly __brand: unique symbol }

testValidate(brand<FileId>()(number()), 45, {}, valid)

//
// instanceOf

testValidate(instanceOf(Date), new Date(2021, 1, 0), {}, valid)
testValidate(instanceOf(Date), '2021-01-01T00:00:00', {}, notInstanceOf(Date))

//
// or

testValidate(or(number(), instanceOf(Date)), new Date(2021, 1, 0), {}, valid)
testValidate(or(number(), instanceOf(Date)), 50, {}, valid)
testValidate(
  or(number(), instanceOf(Date)),
  'Hello',
  {},
  unionOfValidations(unexpectedTypeOf('number', 'Hello'), notInstanceOf(Date))
)
testValidate(
  or(
    fields(discriminantField('type', constant('status')), field('status', number())),
    fields(discriminantField('type', constant('plate')), field('angle', number()))
  ),
  { type: 'keyboard', keys: 45 },
  {},
  unionOfValidations(discriminantInvalid, discriminantInvalid)
)
