import test from 'ava'
import {
  array,
  boolean,
  constant,
  exclusiveFields,
  field,
  fieldReference,
  fields,
  indexedReference,
  integer,
  number,
  optionalField,
  optionalFieldReference,
  string,
  tuple,
} from './claims'

import {
  validateArray,
  validateBoolean,
  validateConstant,
  validateFields,
  validateInteger,
  validateNumber,
  validateString,
  validateTuple,
} from './validate'

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
} from './validation'

test('validateConstant valid', (t) => {
  t.deepEqual(validateConstant(constant(null), null), valid)
  t.deepEqual(validateConstant(constant(undefined), undefined), valid)
  t.deepEqual(validateConstant(constant(true), true), valid)
  t.deepEqual(validateConstant(constant(false), false), valid)
  t.deepEqual(validateConstant(constant(0), 0), valid)
  t.deepEqual(validateConstant(constant(-1), -1), valid)
  t.deepEqual(validateConstant(constant(1), 1), valid)
  t.deepEqual(validateConstant(constant(''), ''), valid)
  t.deepEqual(validateConstant(constant('0'), '0'), valid)
  t.deepEqual(validateConstant(constant(NaN), NaN), valid)
  t.deepEqual(validateConstant(constant(Infinity), Infinity), valid)
  t.deepEqual(validateConstant(constant(-Infinity), -Infinity), valid)
})

test('validateConstant notConstant', (t) => {
  t.deepEqual(validateConstant(constant(null), undefined), notConstant(null, undefined))
  t.deepEqual(validateConstant(constant(undefined), null), notConstant(undefined, null))
  t.deepEqual(validateConstant(constant(true), false), notConstant(true, false))
  t.deepEqual(validateConstant(constant(false), true), notConstant(false, true))
  t.deepEqual(validateConstant(constant(0), 1), notConstant(0, 1))
  t.deepEqual(validateConstant(constant(-1), 1), notConstant(-1, 1))
  t.deepEqual(validateConstant(constant(1), 0), notConstant(1, 0))
  t.deepEqual(validateConstant(constant(''), ' '), notConstant('', ' '))
  t.deepEqual(validateConstant(constant('0'), '1'), notConstant('0', '1'))
  t.deepEqual(validateConstant(constant(NaN), Infinity), notConstant(NaN, Infinity))
  t.deepEqual(validateConstant(constant(Infinity), NaN), notConstant(Infinity, NaN))
  t.deepEqual(validateConstant(constant(-Infinity), Infinity), notConstant(-Infinity, Infinity))
})

test('validateNumber valid', (t) => {
  t.deepEqual(validateNumber(number(), 1), valid)
  t.deepEqual(validateNumber(number(), -1), valid)
  t.deepEqual(validateNumber(number([0, '< n <', 5]), 1), valid)
  t.deepEqual(validateNumber(number([0, '< n <', 5]), 3.5674), valid)
  t.deepEqual(validateNumber(number([0, '< n <', 5]), 4.9), valid)
  t.deepEqual(validateNumber(number([0, '<= n <=', 5]), 0), valid)
  t.deepEqual(validateNumber(number([0, '<= n <=', 5]), 5), valid)
  t.deepEqual(validateNumber(number([-Infinity, '<= n <=', Infinity]), -Infinity), valid)
  t.deepEqual(validateNumber(number([-Infinity, '<= n <=', Infinity]), Infinity), valid)
  t.deepEqual(validateNumber(number([0, '< n <', 5], [15, '< n <', 20]), 16), valid)
})

test('validateNumber unexpectedTypeOf', (t) => {
  t.deepEqual(validateNumber(number(), 'hello'), unexpectedTypeOf('number', 'hello'))
  t.deepEqual(validateNumber(number(), '0'), unexpectedTypeOf('number', '0'))
  t.deepEqual(validateNumber(number(), null), unexpectedTypeOf('number', null))
  t.deepEqual(validateNumber(number(), undefined), unexpectedTypeOf('number', undefined))
})

test('validateNumber notInNumberRanges', (t) => {
  t.deepEqual(validateNumber(number([0, '< n <', 5]), 0), notInNumberRanges([[0, '< n <', 5]], 0))
  t.deepEqual(validateNumber(number([0, '< n <', 5]), 5), notInNumberRanges([[0, '< n <', 5]], 5))
  t.deepEqual(validateNumber(number([0, '<= n <=', 5]), -0.001), notInNumberRanges([[0, '<= n <=', 5]], -0.001))
  t.deepEqual(validateNumber(number([0, '<= n <=', 5]), 5.1), notInNumberRanges([[0, '<= n <=', 5]], 5.1))
  t.deepEqual(
    validateNumber(number([-Infinity, '< n <', Infinity]), -Infinity),
    notInNumberRanges([[-Infinity, '< n <', Infinity]], -Infinity)
  )
  t.deepEqual(
    validateNumber(number([-Infinity, '< n <', Infinity]), Infinity),
    notInNumberRanges([[-Infinity, '< n <', Infinity]], Infinity)
  )
  t.deepEqual(validateNumber(number([0, '< n <', 5], [10, '< n <', 15]), 0), notInNumberRanges([[0, '< n <', 5], [10, '< n <', 15]], 0))
})

test('validateInteger valid', (t) => {
  t.deepEqual(validateInteger(integer(), 1), valid)
  t.deepEqual(validateInteger(integer(), -100), valid)
  t.deepEqual(validateInteger(integer(), 1438384), valid)
})

test('validateInteger unexpectedTypeOf', (t) => {
  t.deepEqual(validateInteger(integer(), 'hello'), unexpectedTypeOf('number', 'hello'))
  t.deepEqual(validateInteger(integer(), '0'), unexpectedTypeOf('number', '0'))
  t.deepEqual(validateInteger(integer(), null), unexpectedTypeOf('number', null))
  t.deepEqual(validateInteger(integer(), undefined), unexpectedTypeOf('number', undefined))
})

test('validateInteger notInteger', (t) => {
  t.deepEqual(validateInteger(integer(), 0.000001), notInteger(0.000001))
  t.deepEqual(validateInteger(integer(), 0 / 0), notInteger(0 / 0))
  t.deepEqual(validateInteger(integer(), Infinity), notInteger(Infinity))
})

test('validateString valid', (t) => {
  t.deepEqual(validateString(string(), ''), valid)
  t.deepEqual(validateString(string(), 'Heya'), valid)
  t.deepEqual(validateString(string(), 'Hello'), valid)
  t.deepEqual(validateString(string(0, 5), ''), valid)
  t.deepEqual(validateString(string(0, 5), 'Heya'), valid)
  t.deepEqual(validateString(string(0, 5), 'Hello'), valid)
})

test('validateString unexpectedTypeOf', (t) => {
  t.deepEqual(validateString(string(), 0), unexpectedTypeOf('string', 0))
  t.deepEqual(validateString(string(), true), unexpectedTypeOf('string', true))
  t.deepEqual(validateString(string(), null), unexpectedTypeOf('string', null))
  t.deepEqual(validateString(string(), undefined), unexpectedTypeOf('string', undefined))
})

test('validateString notInStringRange', (t) => {
  t.deepEqual(validateString(string(1, 4), ''), notInStringRange([1, 4], ''))
  t.deepEqual(validateString(string(1, 4), 'Hello'), notInStringRange([1, 4], 'Hello'))
})

test('validateBoolean valid', (t) => {
  t.deepEqual(validateBoolean(boolean, true), valid)
  t.deepEqual(validateBoolean(boolean, false), valid)
})

test('validateBoolean unexpectedTypeOf', (t) => {
  t.deepEqual(validateBoolean(boolean, 0), unexpectedTypeOf('boolean', 0))
  t.deepEqual(validateBoolean(boolean, 'true'), unexpectedTypeOf('boolean', 'true'))
  t.deepEqual(validateBoolean(boolean, null), unexpectedTypeOf('boolean', null))
  t.deepEqual(validateBoolean(boolean, undefined), unexpectedTypeOf('boolean', undefined))
})

test('validateArray valid', (t) => {
  t.deepEqual(validateArray(array(integer()), [1, 2, 34, 56, 1, 2], {}), valid)
  t.deepEqual(
    validateArray(
      array(array(integer())),
      [
        [1, 2],
        [34, 56, 1, 2],
      ],
      {}
    ),
    valid
  )
  t.deepEqual(validateArray(array(constant(0)), [0, 0, 0, 0], {}), valid)
  t.deepEqual(validateArray(array(boolean), [true, true, false], {}), valid)
})

test('validateArray unexpectedTypeOf', (t) => {
  t.deepEqual(validateArray(array(integer()), 0, {}), unexpectedTypeOf('array', 0))
  t.deepEqual(validateArray(array(integer()), 'true', {}), unexpectedTypeOf('array', 'true'))
  t.deepEqual(validateArray(array(integer()), null, {}), unexpectedTypeOf('array', null))
  t.deepEqual(validateArray(array(integer()), undefined, {}), unexpectedTypeOf('array', undefined))
})

test('validateArray indexedValidations', (t) => {
  t.deepEqual(
    validateArray(array(integer()), [1, 2, 34.67, 56], {}),
    indexedValidations(valid, valid, notInteger(34.67), valid)
  )
  t.deepEqual(
    validateArray(array(integer()), [1, '2', 34.67, 56], {}),
    indexedValidations(valid, unexpectedTypeOf('number', '2'), notInteger(34.67), valid)
  )
  t.deepEqual(
    validateArray(array(array(integer())), [[1, 4], ['2']], {}),
    indexedValidations(valid, indexedValidations(unexpectedTypeOf('number', '2')))
  )
})

test('validateArray indexedReference', (t) => {
  t.deepEqual(validateArray(array(indexedReference('num')), [1, 2, 34, 56, 1, 2], { num: integer() }), valid)
  t.deepEqual(validateArray(array(indexedReference('num')), 0, { num: integer() }), unexpectedTypeOf('array', 0))
  t.deepEqual(
    validateArray(array(indexedReference('num')), [1, 2, 34.67, 56], { num: integer() }),
    indexedValidations(valid, valid, notInteger(34.67), valid)
  )
  t.throws(() => validateArray(array(indexedReference('missing')), [1, 2, 34, 56, 1, 2], {}))
})

test('validateTuple valid', (t) => {
  t.deepEqual(validateTuple(tuple(integer()), [1], {}), valid)
  t.deepEqual(validateTuple(tuple(integer(), boolean), [1, false], {}), valid)
  t.deepEqual(validateTuple(tuple(tuple(integer(), boolean)), [[1, true]], {}), valid)
  t.deepEqual(validateTuple(tuple(constant(0), boolean), [0, false], {}), valid)
  t.deepEqual(validateTuple(tuple(integer(), boolean, constant(null)), [25, false, null], {}), valid)
})

test('validateTuple unexpectedTypeOf', (t) => {
  t.deepEqual(validateTuple(tuple(integer()), 0, {}), unexpectedTypeOf('array', 0))
  t.deepEqual(validateTuple(tuple(integer()), 'true', {}), unexpectedTypeOf('array', 'true'))
  t.deepEqual(validateTuple(tuple(integer()), null, {}), unexpectedTypeOf('array', null))
  t.deepEqual(validateTuple(tuple(integer()), undefined, {}), unexpectedTypeOf('array', undefined))
})

test('validateTuple unexpectedLength', (t) => {
  t.deepEqual(validateTuple(tuple(integer()), [], {}), unexpectedLength(1, []))
  t.deepEqual(validateTuple(tuple(integer()), [1, 2], {}), unexpectedLength(1, [1, 2]))
  t.deepEqual(validateTuple(tuple(integer(), boolean, integer()), [1, false], {}), unexpectedLength(3, [1, false]))
  t.deepEqual(validateTuple(tuple(tuple(integer())), [[0], [1]], {}), unexpectedLength(1, [[0], [1]]))
})

test('validateTuple indexedValidations', (t) => {
  t.deepEqual(validateTuple(tuple(integer()), [0.23], {}), indexedValidations(notInteger(0.23)))
  t.deepEqual(
    validateTuple(tuple(integer(), boolean, integer()), [1, 1, 1], {}),
    indexedValidations(valid, unexpectedTypeOf('boolean', 1), valid)
  )
  t.deepEqual(
    validateTuple(tuple(tuple(integer()), tuple(boolean)), [[1], ['2']], {}),
    indexedValidations(valid, indexedValidations(unexpectedTypeOf('boolean', '2')))
  )
})

test('validateTuple indexedReference', (t) => {
  t.deepEqual(validateTuple(tuple(indexedReference('num')), [1], { num: integer() }), valid)
  t.deepEqual(
    validateTuple(tuple(boolean, indexedReference('num')), [true, 0.23], { num: integer() }),
    indexedValidations(valid, notInteger(0.23))
  )
  t.throws(() => validateTuple(tuple(indexedReference('missing')), [1], {}))
})

test('validateFields valid', (t) => {
  t.deepEqual(validateFields(fields(field('a', integer())), { a: 23 }, {}), valid)
  t.deepEqual(validateFields(fields(field('a', integer()), optionalField('b', boolean)), { a: 23 }, {}), valid)
  t.deepEqual(validateFields(fields(field('a', integer()), optionalField('b', boolean)), { a: 23, b: false }, {}), valid)
  t.deepEqual(validateFields(fields(fieldReference('a', 'n')), { a: true }, { n: boolean }), valid)
  t.deepEqual(validateFields(fields(optionalFieldReference('a', 'n')), { a: true }, { n: boolean }), valid)
  t.deepEqual(validateFields(fields(optionalFieldReference('a', 'n')), {}, { n: boolean }), valid)
  t.deepEqual(validateFields(fields(field('a', integer())), { a: 23, b: 34 }, {}), valid)
  t.deepEqual(validateFields(fields(field('a', integer())), { a: 23, b: { c: 'Hello' } }, {}), valid)
})

test('validateFields unexpectedTypeOf', (t) => {
  t.deepEqual(validateFields(fields(field('a', integer())), 23, {}), unexpectedTypeOf('object', 23))
  t.deepEqual(validateFields(fields(field('a', integer())), [23], {}), unexpectedTypeOf('object', [23]))
  t.deepEqual(validateFields(fields(field('a', integer())), [{ a: 23 }], {}), unexpectedTypeOf('object', [{ a: 23 }]))
})

test('validateFields missing', (t) => {
  t.deepEqual(validateFields(fields(field('a', integer())), { b: 23 }, {}), keyedValidations({ a: missing }, ['b']))
  t.deepEqual(
    validateFields(fields(field('a', integer()), optionalField('b', boolean)), { b: false }, {}),
    keyedValidations({ a: missing, b: valid }, [])
  )
  t.deepEqual(
    validateFields(fields(fieldReference('a', 'n')), { b: 49 }, { n: boolean }),
    keyedValidations({ a: missing }, ['b'])
  )
})

test('validateFields unexpectedKeys', (t) => {
  t.deepEqual(
    validateFields(exclusiveFields(field('a', integer())), { a: 23, b: 'void' }, {}),
    keyedValidations({ a: valid }, ['b'])
  )
})

test('validateFields keyedValidations', (t) => {
  t.deepEqual(
    validateFields(fields(field('a', integer())), { a: 23.5 }, {}),
    keyedValidations({ a: notInteger(23.5) }, [])
  )
})

test('validateFields fieldReference', (t) => {
  t.deepEqual(
    validateFields(fields(fieldReference('a', 'n')), { a: 23.5 }, { n: integer() }),
    keyedValidations({ a: notInteger(23.5) }, [])
  )
  t.deepEqual(validateFields(fields(fieldReference('a', 'n')), { a: 23 }, { n: integer() }), valid)
})
