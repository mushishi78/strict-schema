import { BooleanSchema } from './boolean-schema'
import { NumberSchema } from './number-schema'

export interface SchemaDefinition<S extends Schema> {
  version: 'v1'
  schema: S
}

export type Schema = NumberSchema | BooleanSchema

export function schemaDefinition<S extends Schema>(schema: S): SchemaDefinition<S> {
  return { version: 'v1', schema }
}
