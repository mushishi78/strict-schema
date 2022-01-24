import { isObject } from 'remeda'

export function hasField<FieldName extends string>(fieldName: FieldName) {
  return (obj: unknown): obj is { [k in FieldName]: unknown } => isObject(obj) && fieldName in obj
}
