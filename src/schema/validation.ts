import { NumberRange } from '../lib/number-range'
import { Constructor } from '../lib/type-helpers'
import { ContantTypes } from './claims'

export type Validation = Valid | Failure

export type Failure =
  | NotConstant<any>
  | UnexpectedTypeOf
  | NotInNumberRanges
  | NotInteger
  | NotInStringRange
  | IndexedValidations<any>
  | UnexpectedLength
  | KeyedValidations<any>
  | Missing
  | NotInstanceOf<any>

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

export interface NotInNumberRanges {
  validationType: 'NotInNumberRanges'
  numberRanges: NumberRange[]
  value: number
}

export const notInNumberRanges = (numberRanges: NumberRange[], value: number): NotInNumberRanges => ({
  validationType: 'NotInNumberRanges',
  numberRanges,
  value,
})

export interface NotInteger {
  validationType: 'NotInteger'
  value: number
}

export const notInteger = (value: number): NotInteger => ({ validationType: 'NotInteger', value })

export interface NotInStringRange {
  validationType: 'NotInStringRange'
  stringRange: [number, number]
  value: string
}

export const notInStringRange = (stringRange: [number, number], value: string): NotInStringRange => ({
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

export interface KeyedValidations<Vs extends Record<string, Validation>> {
  validationType: 'KeyedValidations'
  validations: Vs
  unexpectedKeys: string[]
}

export const keyedValidations = <Vs extends Record<string, Validation>>(
  validations: Vs,
  unexpectedKeys: string[]
): KeyedValidations<Vs> => ({
  validationType: 'KeyedValidations',
  validations,
  unexpectedKeys,
})

export interface Missing {
  validationType: 'Missing'
}

export const missing: Missing = { validationType: 'Missing' }

export interface NotInstanceOf<C extends Constructor> {
  validationType: 'NotInstanceOf'
  constructor: C
}

export const notInstanceOf = <C extends Constructor>(constructor: C): NotInstanceOf<C> => ({
  validationType: 'NotInstanceOf',
  constructor,
})
