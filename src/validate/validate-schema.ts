import { SchemaDefinition, Schema, isNumberSchema, isBooleanSchema, BooleanSchema, NumberSchema } from '../schema'
import { validateBoolean, BooleanValidation } from './validate-boolean'
import { validateNumber, NumberValidation } from './validate-number'

export function validateSchema(definition: SchemaDefinition<BooleanSchema>, value: unknown): BooleanValidation
export function validateSchema(definition: SchemaDefinition<NumberSchema>, value: unknown): NumberValidation
export function validateSchema<S extends Schema>(definition: SchemaDefinition<S>, value: unknown) {
  const { schema } = definition
  if (isNumberSchema(schema)) return validateNumber(schema, value)
  if (isBooleanSchema(schema)) return validateBoolean(schema, value)
  throw new Error('Unregonised schema type')
}
