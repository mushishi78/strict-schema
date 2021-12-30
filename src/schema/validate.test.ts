import test from 'ava'
import { array, boolean, constant, indexedReference, integer, numberRange, stringRange, tuple } from './claims'

import {
  validateArray,
  validateBoolean,
  validateConstant,
  validateInteger,
  validateNumberRange,
  validateStringRange,
  validateTuple,
} from './validate'

import {
  valid,
  notConstant,
  unexpectedTypeOf,
  notInNumberRange,
  notInteger,
  notInStringRange,
  indexedFailures,
  failureAtIndex,
  unexpectedLength,
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

test('validateNumberRange valid', (t) => {
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), 1), valid)
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), 3.5674), valid)
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), 4.9), valid)
  t.deepEqual(validateNumberRange(numberRange([0, '<= n <=', 5]), 0), valid)
  t.deepEqual(validateNumberRange(numberRange([0, '<= n <=', 5]), 5), valid)
  t.deepEqual(validateNumberRange(numberRange([-Infinity, '<= n <=', Infinity]), -Infinity), valid)
  t.deepEqual(validateNumberRange(numberRange([-Infinity, '<= n <=', Infinity]), Infinity), valid)
})

test('validateNumberRange unexpectedTypeOf', (t) => {
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), 'hello'), unexpectedTypeOf('number', 'hello'))
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), '0'), unexpectedTypeOf('number', '0'))
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), null), unexpectedTypeOf('number', null))
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), undefined), unexpectedTypeOf('number', undefined))
})

test('validateNumberRange notInNumberRange', (t) => {
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), 0), notInNumberRange([0, '< n <', 5], 0))
  t.deepEqual(validateNumberRange(numberRange([0, '< n <', 5]), 5), notInNumberRange([0, '< n <', 5], 5))
  t.deepEqual(validateNumberRange(numberRange([0, '<= n <=', 5]), -0.001), notInNumberRange([0, '<= n <=', 5], -0.001))
  t.deepEqual(validateNumberRange(numberRange([0, '<= n <=', 5]), 5.1), notInNumberRange([0, '<= n <=', 5], 5.1))
  t.deepEqual(
    validateNumberRange(numberRange([-Infinity, '< n <', Infinity]), -Infinity),
    notInNumberRange([-Infinity, '< n <', Infinity], -Infinity)
  )
  t.deepEqual(
    validateNumberRange(numberRange([-Infinity, '< n <', Infinity]), Infinity),
    notInNumberRange([-Infinity, '< n <', Infinity], Infinity)
  )
})

test('validateInteger valid', (t) => {
  t.deepEqual(validateInteger(integer, 1), valid)
  t.deepEqual(validateInteger(integer, -100), valid)
  t.deepEqual(validateInteger(integer, 1438384), valid)
})

test('validateInteger unexpectedTypeOf', (t) => {
  t.deepEqual(validateInteger(integer, 'hello'), unexpectedTypeOf('number', 'hello'))
  t.deepEqual(validateInteger(integer, '0'), unexpectedTypeOf('number', '0'))
  t.deepEqual(validateInteger(integer, null), unexpectedTypeOf('number', null))
  t.deepEqual(validateInteger(integer, undefined), unexpectedTypeOf('number', undefined))
})

test('validateInteger notInteger', (t) => {
  t.deepEqual(validateInteger(integer, 0.000001), notInteger(0.000001))
  t.deepEqual(validateInteger(integer, 0 / 0), notInteger(0 / 0))
  t.deepEqual(validateInteger(integer, Infinity), notInteger(Infinity))
})

test('validateStringRange valid', (t) => {
  t.deepEqual(validateStringRange(stringRange([0, 5]), ''), valid)
  t.deepEqual(validateStringRange(stringRange([0, 5]), 'Heya'), valid)
  t.deepEqual(validateStringRange(stringRange([0, 5]), 'Hello'), valid)
})

test('validateStringRange unexpectedTypeOf', (t) => {
  t.deepEqual(validateStringRange(stringRange([0, 5]), 0), unexpectedTypeOf('string', 0))
  t.deepEqual(validateStringRange(stringRange([0, 5]), true), unexpectedTypeOf('string', true))
  t.deepEqual(validateStringRange(stringRange([0, 5]), null), unexpectedTypeOf('string', null))
  t.deepEqual(validateStringRange(stringRange([0, 5]), undefined), unexpectedTypeOf('string', undefined))
})

test('validateStringRange notInStringRange', (t) => {
  t.deepEqual(validateStringRange(stringRange([1, 4]), ''), notInStringRange([1, 4], ''))
  t.deepEqual(validateStringRange(stringRange([1, 4]), 'Hello'), notInStringRange([1, 4], 'Hello'))
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
  t.deepEqual(validateArray(array(integer), [1, 2, 34, 56, 1, 2], {}), valid)
  t.deepEqual(
    validateArray(array(array(integer)), [
      [1, 2],
      [34, 56, 1, 2],
    ], {}),
    valid
  )
  t.deepEqual(validateArray(array(constant(0)), [0, 0, 0, 0], {}), valid)
  t.deepEqual(validateArray(array(boolean), [true, true, false], {}), valid)
})

test('validateArray unexpectedTypeOf', (t) => {
  t.deepEqual(validateArray(array(integer), 0, {}), unexpectedTypeOf('array', 0))
  t.deepEqual(validateArray(array(integer), 'true', {}), unexpectedTypeOf('array', 'true'))
  t.deepEqual(validateArray(array(integer), null, {}), unexpectedTypeOf('array', null))
  t.deepEqual(validateArray(array(integer), undefined, {}), unexpectedTypeOf('array', undefined))
})

test('validateArray indexedFailures', (t) => {
  t.deepEqual(validateArray(array(integer), [1, 2, 34.67, 56], {}), indexedFailures([failureAtIndex(2, notInteger(34.67))]))
  t.deepEqual(
    validateArray(array(integer), [1, '2', 34.67, 56], {}),
    indexedFailures([failureAtIndex(1, unexpectedTypeOf('number', '2')), failureAtIndex(2, notInteger(34.67))])
  )
  t.deepEqual(
    validateArray(array(array(integer)), [[1, 4], ['2']], {}),
    indexedFailures([failureAtIndex(1, indexedFailures([failureAtIndex(0, unexpectedTypeOf('number', '2'))]))])
  )
})

test('validateArray indexedReference', (t) => {
  t.deepEqual(validateArray(array(indexedReference('num')), [1, 2, 34, 56, 1, 2], { num: integer }), valid)
  t.deepEqual(validateArray(array(indexedReference('num')), 0, { num: integer }), unexpectedTypeOf('array', 0))
  t.deepEqual(validateArray(array(indexedReference('num')), [1, 2, 34.67, 56], { num: integer }), indexedFailures([failureAtIndex(2, notInteger(34.67))]))
  t.throws(() => validateArray(array(indexedReference('missing')), [1, 2, 34, 56, 1, 2], {}))
})

test('validateTuple valid', (t) => {
  t.deepEqual(validateTuple(tuple(integer), [1], {}), valid)
  t.deepEqual(validateTuple(tuple(integer, boolean), [1, false], {}), valid)
  t.deepEqual(validateTuple(tuple(tuple(integer, boolean)), [[1, true]], {}), valid)
  t.deepEqual(validateTuple(tuple(constant(0), boolean), [0, false], {}), valid)
  t.deepEqual(validateTuple(tuple(integer, boolean, constant(null)), [25, false, null], {}), valid)
})

test('validateTuple unexpectedTypeOf', (t) => {
  t.deepEqual(validateTuple(tuple(integer), 0, {}), unexpectedTypeOf('array', 0))
  t.deepEqual(validateTuple(tuple(integer), 'true', {}), unexpectedTypeOf('array', 'true'))
  t.deepEqual(validateTuple(tuple(integer), null, {}), unexpectedTypeOf('array', null))
  t.deepEqual(validateTuple(tuple(integer), undefined, {}), unexpectedTypeOf('array', undefined))
})

test('validateTuple unexpectedLength', (t) => {
  t.deepEqual(validateTuple(tuple(integer), [], {}), unexpectedLength(1, []))
  t.deepEqual(validateTuple(tuple(integer), [1, 2], {}), unexpectedLength(1, [1, 2]))
  t.deepEqual(validateTuple(tuple(integer, boolean, integer), [1, false], {}), unexpectedLength(3, [1, false]))
  t.deepEqual(validateTuple(tuple(tuple(integer)), [[0], [1]], {}), unexpectedLength(1, [[0], [1]]))
})

test('validateTuple indexedFailures', (t) => {
  t.deepEqual(validateTuple(tuple(integer), [0.23], {}), indexedFailures([failureAtIndex(0, notInteger(0.23))]))
  t.deepEqual(
    validateTuple(tuple(integer, boolean, integer), [1, 1, 1], {}),
    indexedFailures([failureAtIndex(1, unexpectedTypeOf('boolean', 1))])
  )
  t.deepEqual(
    validateTuple(tuple(tuple(integer), tuple(boolean)), [[1], ['2']], {}),
    indexedFailures([failureAtIndex(1, indexedFailures([failureAtIndex(0, unexpectedTypeOf('boolean', '2'))]))])
  )
})

test('validateTuple indexedReference', (t) => {
  t.deepEqual(validateTuple(tuple(indexedReference('num')), [1], { num: integer }), valid)
  t.deepEqual(validateTuple(tuple(boolean, indexedReference('num')), [true, 0.23], { num: integer }), indexedFailures([failureAtIndex(1, notInteger(0.23))]))
  t.throws(() => validateTuple(tuple(indexedReference('missing')), [1], {}))
})
