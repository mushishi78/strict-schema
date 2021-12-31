import { NumberRange } from '../lib/number-range'
import { StringRange } from '../lib/string-range'
import { ContantTypes } from './claims'

export type Validation = Valid | Failure

export type Failure =
  | NotConstant<any>
  | UnexpectedTypeOf
  | NotInNumberRange
  | NotInteger
  | NotInStringRange
  | IndexedValidations<any>
  | UnexpectedLength

export interface Valid {
  validationType: 'Valid'
}

export const valid: Valid = { validationType: 'Valid' }
export const isValid = (validation: Validation): validation is Valid => validation.validationType === 'Valid'

export interface NotConstant<Constant extends ContantTypes> {
  validationType: 'NotConstant'
  constant: Constant
  value: unknown
}

export const notConstant = <Constant extends ContantTypes>(
  constant: Constant,
  value: unknown
): NotConstant<Constant> => ({
  validationType: 'NotConstant',
  constant,
  value,
})

export interface UnexpectedTypeOf {
  validationType: 'UnexpectedTypeOf'
  expectedTypeOf: string
  value: unknown
}

export const unexpectedTypeOf = (expectedTypeOf: string, value: unknown): UnexpectedTypeOf => ({
  validationType: 'UnexpectedTypeOf',
  expectedTypeOf,
  value,
})

export interface NotInNumberRange {
  validationType: 'NotInNumberRange'
  numberRange: NumberRange
  value: number
}

export const notInNumberRange = (numberRange: NumberRange, value: number): NotInNumberRange => ({
  validationType: 'NotInNumberRange',
  numberRange,
  value,
})

export interface NotInteger {
  validationType: 'NotInteger'
  value: number
}

export const notInteger = (value: number): NotInteger => ({ validationType: 'NotInteger', value })

export interface NotInStringRange {
  validationType: 'NotInStringRange'
  stringRange: StringRange
  value: string
}

export const notInStringRange = (stringRange: StringRange, value: string): NotInStringRange => ({
  validationType: 'NotInStringRange',
  stringRange,
  value,
})

export interface IndexedValidations<Vs extends Validation[]> {
  validationType: 'IndexedValidations'
  validations: Vs
}

export const indexedValidations = <Vs extends Validation[]>(...validations: Vs): IndexedValidations<Vs> => ({
  validationType: 'IndexedValidations',
  validations,
})

export interface UnexpectedLength {
  validationType: 'UnexpectedLength'
  length: number
  value: unknown[]
}

export const unexpectedLength = (length: number, value: unknown[]): UnexpectedLength => ({
  validationType: 'UnexpectedLength',
  length,
  value,
})
