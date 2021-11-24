import { anyStringRange, nonEmptyStringRange, StringRange } from '../lib/string-range'
import { SchemaType } from './schema-type'

export interface StringSchema<Constants extends string = never>
  extends SchemaType<'StringSchema', StringProperties<Constants>> {}

export function isStringSchema(schema: SchemaType<string, {}>): schema is StringSchema {
  return schema.schemaType === 'StringSchema'
}

export interface StringProperties<Constants extends string = never> {
  allow: Array<StringRange | Constants | undefined | null>
}

export const defaultStringProperties: StringProperties = {
  allow: [anyStringRange],
}

export function stringSchema<Constants extends string = never>(
  properties?: StringProperties<Constants>
): StringSchema<Constants> {
  return {
    schemaType: 'StringSchema',
    properties: { ...defaultStringProperties, ...properties },
  }
}

export const string = stringSchema()
export const nonEmptyString = stringSchema<never>({ allow: [nonEmptyStringRange] })
export const stringConstants = <Constants extends string>(...constants: Constants[]) =>
  stringSchema({ allow: constants })
