import test from 'ava'
import { validateBoolean } from './validate-boolean'
import { notAllowed, unexpectedTypeOf, valid } from './validation'
import { boolean, booleanSchema, onlyFalse, onlyTrue } from '../schema/boolean-schema'

test('boolean-validate boolean', (t) => {
  const { allow } = boolean.properties
  t.deepEqual(validateBoolean(boolean, true), valid)
  t.deepEqual(validateBoolean(boolean, false), valid)
  t.deepEqual(validateBoolean(boolean, null), notAllowed(allow, null))
  t.deepEqual(validateBoolean(boolean, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateBoolean(boolean, [true]), unexpectedTypeOf('boolean', [true]))
  t.deepEqual(validateBoolean(boolean, {}), unexpectedTypeOf('boolean', {}))
  t.deepEqual(validateBoolean(boolean, 'hello'), unexpectedTypeOf('boolean', 'hello'))
})

test('boolean-validate onlyTrue', (t) => {
  const { allow } = onlyTrue.properties
  t.deepEqual(validateBoolean(onlyTrue, true), valid)
  t.deepEqual(validateBoolean(onlyTrue, false), notAllowed(allow, false))
  t.deepEqual(validateBoolean(onlyTrue, null), notAllowed(allow, null))
  t.deepEqual(validateBoolean(onlyTrue, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateBoolean(onlyTrue, [true]), unexpectedTypeOf('boolean', [true]))
  t.deepEqual(validateBoolean(onlyTrue, {}), unexpectedTypeOf('boolean', {}))
  t.deepEqual(validateBoolean(onlyTrue, 'hello'), unexpectedTypeOf('boolean', 'hello'))
})

test('boolean-validate onlyFalse', (t) => {
  const { allow } = onlyFalse.properties
  t.deepEqual(validateBoolean(onlyFalse, true), notAllowed(allow, true))
  t.deepEqual(validateBoolean(onlyFalse, false), valid)
  t.deepEqual(validateBoolean(onlyFalse, null), notAllowed(allow, null))
  t.deepEqual(validateBoolean(onlyFalse, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateBoolean(onlyFalse, [true]), unexpectedTypeOf('boolean', [true]))
  t.deepEqual(validateBoolean(onlyFalse, {}), unexpectedTypeOf('boolean', {}))
  t.deepEqual(validateBoolean(onlyFalse, 'hello'), unexpectedTypeOf('boolean', 'hello'))
})

test('boolean-validate boolean with null', (t) => {
  const schema = booleanSchema({ allow: [true, false, null] })
  const { allow } = schema.properties
  t.deepEqual(validateBoolean(schema, true), valid)
  t.deepEqual(validateBoolean(schema, false), valid)
  t.deepEqual(validateBoolean(schema, null), valid)
  t.deepEqual(validateBoolean(schema, undefined), notAllowed(allow, undefined))
  t.deepEqual(validateBoolean(schema, [true]), unexpectedTypeOf('boolean', [true]))
  t.deepEqual(validateBoolean(schema, {}), unexpectedTypeOf('boolean', {}))
  t.deepEqual(validateBoolean(schema, 'hello'), unexpectedTypeOf('boolean', 'hello'))
})

test('boolean-validate boolean with undefined', (t) => {
  const schema = booleanSchema({
    allow: [true, false, undefined],
  })
  const { allow } = schema.properties
  t.deepEqual(validateBoolean(schema, true), valid)
  t.deepEqual(validateBoolean(schema, false), valid)
  t.deepEqual(validateBoolean(schema, null), notAllowed(allow, null))
  t.deepEqual(validateBoolean(schema, undefined), valid)
  t.deepEqual(validateBoolean(schema, [true]), unexpectedTypeOf('boolean', [true]))
  t.deepEqual(validateBoolean(schema, {}), unexpectedTypeOf('boolean', {}))
  t.deepEqual(validateBoolean(schema, 'hello'), unexpectedTypeOf('boolean', 'hello'))
})
