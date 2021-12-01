import test from 'ava'
import { constant, integer, numberRange, stringRange } from './claims'
import { validateConstant, validateInteger, validateNumberRange, validateStringRange } from './validate'

import { valid, notConstant, unexpectedTypeOf, notInNumberRange, notInteger, notInStringRange } from './validation'

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
})

test('validateStringRange notInStringRange', (t) => {
  t.deepEqual(validateStringRange(stringRange([1, 4]), ''), notInStringRange([1, 4], ''))
  t.deepEqual(validateStringRange(stringRange([1, 4]), 'Hello'), notInStringRange([1, 4], 'Hello'))
})
