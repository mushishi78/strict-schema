import test from 'ava'
import { constant } from './claims'
import { notConstant, valid, validateConstant } from './validate'

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
