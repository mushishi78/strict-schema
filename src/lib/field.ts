import { isNever } from './type-helpers'

import {
  Field,
  isDiscriminantField,
  isFieldReference,
  isOptionalField,
  isOptionalFieldReference,
  isRegularField,
} from '../claims'

export function getFieldKey(field: Field): string {
  if (isRegularField(field)) return field.field.key
  if (isOptionalField(field)) return field.optionalField.key
  if (isDiscriminantField(field)) return field.discriminantField.key
  if (isFieldReference(field)) return field.fieldReference.key
  if (isOptionalFieldReference(field)) return field.optionalFieldReference.key
  throw isNever(field)
}

export function isFieldOptional(field: Field): boolean {
  if (isRegularField(field)) return false
  if (isOptionalField(field)) return true
  if (isDiscriminantField(field)) return false
  if (isFieldReference(field)) return false
  if (isOptionalFieldReference(field)) return true
  throw isNever(field)
}

export function isFieldDiscriminant(field: Field): boolean {
  if (isRegularField(field)) return false
  if (isOptionalField(field)) return false
  if (isDiscriminantField(field)) return true
  if (isFieldReference(field)) return false
  if (isOptionalFieldReference(field)) return false
  throw isNever(field)
}
