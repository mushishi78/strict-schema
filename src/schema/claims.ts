import { NumberRange } from '../lib/number-range'
import { hasField } from '../lib/unknown'

export type Claim =
  | ConstantClaim<any>
  | NumberClaim
  | IntegerClaim
  | StringClaim
  | UuidClaim
  | DateStringClaim
  | BooleanClaim
  | UnknownClaim
  | NeverClaim
  | ArrayClaim<any>
  | TupleClaim<any>
  | FieldsClaim<any>
  | BrandClaim<any, any>
  | InstanceOfClaim<any>
  | OrClaim<any>

export type IndexedClaim = Claim | IndexedReference<any>

export type ContantTypes = string | number | boolean | null | undefined | object | Array<any>
export type ConstantClaim<T extends ContantTypes> = { constant: T }
export const constant = <T extends ContantTypes>(constant: T): ConstantClaim<T> => ({ constant })
export const isConstantClaim = hasField('constant')

export type NumberClaim = { number: { ranges: NumberRange[] } }
export const number = (...ranges: NumberRange[]): NumberClaim => ({ number: { ranges } })
export const isNumberClaim = hasField('number')

export type IntegerClaim = { integer: { ranges: NumberRange[] } }
export const integer = (...ranges: NumberRange[]): IntegerClaim => ({ integer: { ranges } })
export const isIntegerClaim = hasField('integer')

export type StringClaim = { string: { range: [number, number] } }
export const string = (min = 0, max = Infinity): StringClaim => ({ string: { range: [min, max] } })
export const isStringClaim = hasField('string')

export type UuidClaim = { uuid: {} }
export const uuid = (): UuidClaim => ({ uuid: {} })
export const isUuidClaim = hasField('uuid')

export type DateStringClaim = { dateString: { format: 'rfc3339' | 'iso8601' } }
export const dateString = (format: 'rfc3339' | 'iso8601' = 'rfc3339'): DateStringClaim => ({ dateString: { format } })
export const isDateStringClaim = hasField('dateString')

export type BooleanClaim = { boolean: {} }
export const boolean: BooleanClaim = { boolean: {} }
export const isBooleanClaim = hasField('boolean')

export type UnknownClaim = { unknown: {} }
export const unknown: UnknownClaim = { unknown: {} }
export const isUnknownClaim = hasField('unknown')

export type NeverClaim = { never: {} }
export const never: NeverClaim = { never: {} }
export const isNeverClaim = hasField('never')

export type ArrayClaim<C extends IndexedClaim> = { array: C }
export const array = <C extends IndexedClaim>(claim: C): ArrayClaim<C> => ({ array: claim })
export const isArrayClaim = hasField('array')

export type TupleClaim<Cs extends IndexedClaim[]> = { tuple: Cs }
export const tuple = <Cs extends IndexedClaim[]>(...claims: Cs): TupleClaim<Cs> => ({ tuple: claims })
export const isTupleClaim = hasField('tuple')

export type IndexedReference<R extends string> = { indexedReference: R }
export const indexedReference = <R extends string>(indexedReference: R): IndexedReference<R> => ({ indexedReference })
export const isIndexedReference = hasField('indexedReference')

export type Field = [string, Claim] | FieldReference<string, string>
export type FieldReference<K extends string, R extends string> = { fieldReference: [K, R] }
export const fieldReference = <K extends string, R extends string>(key: K, ref: R): FieldReference<K, R> => ({
  fieldReference: [key, ref],
})

export type FieldsClaim<Fs extends Field[]> = { fields: Fs; exclusive: boolean }
export const field = <K extends string, C extends Claim>(key: K, claim: C): [K, C] => [key, claim]
export const fields = <Fs extends Field[]>(...fields: Fs): FieldsClaim<Fs> => ({ fields, exclusive: false })
export const exclusiveFields = <Fs extends Field[]>(...fields: Fs): FieldsClaim<Fs> => ({
  fields,
  exclusive: true,
})
export const isFieldsClaim = hasField('fields')

export type BrandClaim<Brand, C extends Claim> = { branded: C }
export const brand = <Brand>() => <C extends Claim>(claim: C): BrandClaim<Brand, C> => ({ branded: claim })
export const isBrandClaim = hasField('branded')

type Constructor = new (...args: any) => any
export type InstanceOfClaim<C extends Constructor = never> = { instanceOf: C }
export const instanceOf = <C extends Constructor = never>(instanceOf: C): InstanceOfClaim<C> => ({
  instanceOf,
})
export const isInstanceOfClaim = hasField('instanceOf')

export type OrClaim<Cs extends Claim[]> = { or: Cs }
export const or = <Cs extends Claim[]>(...or: Cs): OrClaim<Cs> => ({ or })
export const isOrClaim = hasField('or')
