import test from 'ava'
import { validateNumber, expectedInteger } from './validate-number'
import { notAllowed, unexpectedTypeOf, valid, multipleFailures } from './validation'

import {
  number,
  integer,
  positiveNumber,
  positiveInteger,
  negativeNumber,
  negativeInteger,
  anyNumber,
} from '../schema/number-schema'

test('validateNumber number', (t) => {
  const { allow } = number.properties
  t.deepEqual(validateNumber(number, 0), valid)
  t.deepEqual(validateNumber(number, 1), valid)
  t.deepEqual(validateNumber(number, -1), valid)
  t.deepEqual(validateNumber(number, 0.56), valid)
  t.deepEqual(validateNumber(number, -0.56), valid)
  t.deepEqual(validateNumber(number, Infinity), notAllowed(allow, Infinity))
  t.deepEqual(validateNumber(number, NaN), notAllowed(allow, NaN))
  t.deepEqual(validateNumber(number, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(number, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(number, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(number, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(number, 'hello'), unexpectedTypeOf('number', 'hello'))
})

test('validateNumber integer', (t) => {
  const { allow } = integer.properties
  t.deepEqual(validateNumber(integer, 0), valid)
  t.deepEqual(validateNumber(integer, 1), valid)
  t.deepEqual(validateNumber(integer, -1), valid)
  t.deepEqual(validateNumber(integer, 0.56), expectedInteger(0.56))
  t.deepEqual(validateNumber(integer, -0.56), expectedInteger(-0.56))
  t.deepEqual(
    validateNumber(integer, Infinity),
    multipleFailures(expectedInteger(Infinity), notAllowed(allow, Infinity))
  )
  t.deepEqual(validateNumber(integer, NaN), multipleFailures(expectedInteger(NaN), notAllowed(allow, NaN)))
  t.deepEqual(validateNumber(integer, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(integer, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(integer, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(integer, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(integer, 'hello'), unexpectedTypeOf('number', 'hello'))
})

test('validateNumber positiveNumber', (t) => {
  const { allow } = positiveNumber.properties
  t.deepEqual(validateNumber(positiveNumber, 0), valid)
  t.deepEqual(validateNumber(positiveNumber, 1), valid)
  t.deepEqual(validateNumber(positiveNumber, -1), notAllowed(allow, -1))
  t.deepEqual(validateNumber(positiveNumber, 0.56), valid)
  t.deepEqual(validateNumber(positiveNumber, -0.56), notAllowed(allow, -0.56))
  t.deepEqual(validateNumber(positiveNumber, Infinity), notAllowed(allow, Infinity))
  t.deepEqual(validateNumber(positiveNumber, NaN), notAllowed(allow, NaN))
  t.deepEqual(validateNumber(positiveNumber, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(positiveNumber, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(positiveNumber, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(positiveNumber, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(positiveNumber, 'hello'), unexpectedTypeOf('number', 'hello'))
})

test('validateNumber positiveInteger', (t) => {
  const { allow } = positiveInteger.properties
  t.deepEqual(validateNumber(positiveInteger, 0), valid)
  t.deepEqual(validateNumber(positiveInteger, 1), valid)
  t.deepEqual(validateNumber(positiveInteger, -1), notAllowed(allow, -1))
  t.deepEqual(validateNumber(positiveInteger, 0.56), expectedInteger(0.56))
  t.deepEqual(
    validateNumber(positiveInteger, -0.56),
    multipleFailures(expectedInteger(-0.56), notAllowed(allow, -0.56))
  )
  t.deepEqual(
    validateNumber(positiveInteger, Infinity),
    multipleFailures(expectedInteger(Infinity), notAllowed(allow, Infinity))
  )
  t.deepEqual(validateNumber(positiveInteger, NaN), multipleFailures(expectedInteger(NaN), notAllowed(allow, NaN)))
  t.deepEqual(validateNumber(positiveInteger, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(positiveInteger, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(positiveInteger, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(positiveInteger, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(positiveInteger, 'hello'), unexpectedTypeOf('number', 'hello'))
})

test('validateNumber negativeNumber', (t) => {
  const { allow } = negativeNumber.properties
  t.deepEqual(validateNumber(negativeNumber, 0), valid)
  t.deepEqual(validateNumber(negativeNumber, 1), notAllowed(allow, 1))
  t.deepEqual(validateNumber(negativeNumber, -1), valid)
  t.deepEqual(validateNumber(negativeNumber, 0.56), notAllowed(allow, 0.56))
  t.deepEqual(validateNumber(negativeNumber, -0.56), valid)
  t.deepEqual(validateNumber(negativeNumber, Infinity), notAllowed(allow, Infinity))
  t.deepEqual(validateNumber(negativeNumber, NaN), notAllowed(allow, NaN))
  t.deepEqual(validateNumber(negativeNumber, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(negativeNumber, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(negativeNumber, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(negativeNumber, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(negativeNumber, 'hello'), unexpectedTypeOf('number', 'hello'))
})

test('validateNumber negativeInteger', (t) => {
  const { allow } = negativeInteger.properties
  t.deepEqual(validateNumber(negativeInteger, 0), valid)
  t.deepEqual(validateNumber(negativeInteger, 1), notAllowed(allow, 1))
  t.deepEqual(validateNumber(negativeInteger, -1), valid)
  t.deepEqual(validateNumber(negativeInteger, 0.56), multipleFailures(expectedInteger(0.56), notAllowed(allow, 0.56)))
  t.deepEqual(validateNumber(negativeInteger, -0.56), expectedInteger(-0.56))
  t.deepEqual(
    validateNumber(negativeInteger, Infinity),
    multipleFailures(expectedInteger(Infinity), notAllowed(allow, Infinity))
  )
  t.deepEqual(validateNumber(negativeInteger, NaN), multipleFailures(expectedInteger(NaN), notAllowed(allow, NaN)))
  t.deepEqual(validateNumber(negativeInteger, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(negativeInteger, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(negativeInteger, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(negativeInteger, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(negativeInteger, 'hello'), unexpectedTypeOf('number', 'hello'))
})

test('validateNumber anyNumber', (t) => {
  const { allow } = anyNumber.properties
  t.deepEqual(validateNumber(anyNumber, 0), valid)
  t.deepEqual(validateNumber(anyNumber, 1), valid)
  t.deepEqual(validateNumber(anyNumber, -1), valid)
  t.deepEqual(validateNumber(anyNumber, 0.56), valid)
  t.deepEqual(validateNumber(anyNumber, -0.56), valid)
  t.deepEqual(validateNumber(anyNumber, Infinity), valid)
  t.deepEqual(validateNumber(anyNumber, NaN), valid)
  t.deepEqual(validateNumber(anyNumber, null), notAllowed(allow, null))
  t.deepEqual(validateNumber(anyNumber, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateNumber(anyNumber, [true]), unexpectedTypeOf('number', [true]))
  t.deepEqual(validateNumber(anyNumber, {}), unexpectedTypeOf('number', {}))
  t.deepEqual(validateNumber(anyNumber, 'hello'), unexpectedTypeOf('number', 'hello'))
})
