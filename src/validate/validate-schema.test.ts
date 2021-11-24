import test from 'ava'
import { valid } from './validation'
import { boolean } from '../schema/boolean-schema'
import { validateSchema } from './validate-schema'
import { number, schemaDefinition } from '../schema'
import { BooleanValidation } from './validate-boolean'
import { NumberValidation } from './validate-number'

test('validateSchema boolean', (t) => {
  const result: BooleanValidation = validateSchema(schemaDefinition(boolean), true)
  t.deepEqual(result, valid)
})

test('validateSchema number', (t) => {
  const result: NumberValidation = validateSchema(schemaDefinition(number), 5)
  t.deepEqual(result, valid)
})
