import { isObject } from 'remeda'
import { NumberRange } from '../lib/number-range'
import { StringRange } from '../lib/string-range'

export type Claim =
  | ConstantClaim<any>
  | NumberClaim
  | IntegerClaim
  | StringRangeClaim
  | BooleanClaim
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
export const isConstantClaim = (claim: unknown): claim is ConstantClaim<ContantTypes> =>
  isObject(claim) && 'constant' in claim

export type NumberClaim = { numberRanges: NumberRange[] }
export const number = (...numberRanges: NumberRange[]): NumberClaim => ({ numberRanges })
export const isNumberClaim = (claim: unknown): claim is NumberClaim => isObject(claim) && 'numberRanges' in claim

export type IntegerClaim = { integerRanges: NumberRange[] }
export const integer = (...integerRanges: NumberRange[]): IntegerClaim => ({ integerRanges })
export const isIntegerClaim = (claim: unknown): claim is IntegerClaim => isObject(claim) && 'integerRanges' in claim

export type StringRangeClaim = { stringRange: StringRange }
export const stringRange = (stringRange: StringRange): StringRangeClaim => ({ stringRange })
export const isStringRangeClaim = (claim: unknown): claim is StringRangeClaim =>
  isObject(claim) && 'stringRange' in claim

export type BooleanClaim = 'Boolean'
export const boolean: BooleanClaim = 'Boolean'
export const isBooleanClaim = (claim: unknown): claim is BooleanClaim => claim === 'Boolean'

export type ArrayClaim<C extends IndexedClaim> = { array: C }
export const array = <C extends IndexedClaim>(claim: C): ArrayClaim<C> => ({ array: claim })
export const isArrayClaim = (claim: unknown): claim is ArrayClaim<any> => isObject(claim) && 'array' in claim

export type TupleClaim<Cs extends IndexedClaim[]> = { tuple: Cs }
export const tuple = <Cs extends IndexedClaim[]>(...claims: Cs): TupleClaim<Cs> => ({ tuple: claims })
export const isTupleClaim = (claim: unknown): claim is TupleClaim<any> => isObject(claim) && 'tuple' in claim

export type IndexedReference<R extends string> = { indexedReference: R }
export const indexedReference = <R extends string>(indexedReference: R): IndexedReference<R> => ({ indexedReference })
export const isIndexedReference = (obj: unknown): obj is IndexedReference<any> =>
  isObject(obj) && 'indexedReference' in obj

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
export const isFieldsClaim = (claim: unknown): claim is FieldsClaim<any> => isObject(claim) && 'fields' in claim

export type BrandClaim<Brand, C extends Claim> = { branded: C }
export const brand = <Brand>() => <C extends Claim>(claim: C): BrandClaim<Brand, C> => ({ branded: claim })
export const isBrandClaim = (claim: unknown): claim is BrandClaim<any, any> => isObject(claim) && 'branded' in claim

type Constructor = new (...args: any) => any
export type InstanceOfClaim<C extends Constructor = never> = { instanceOf: C }
export const instanceOf = <C extends Constructor = never>(instanceOf: C): InstanceOfClaim<C> => ({
  instanceOf,
})
export const isInstanceOfClaim = (claim: unknown): claim is InstanceOfClaim<any> =>
  isObject(claim) && 'instanceOf' in claim

export type OrClaim<Cs extends Claim[]> = { or: Cs }
export const or = <Cs extends Claim[]>(...or: Cs): OrClaim<Cs> => ({ or })
export const isOrClaim = (claim: unknown): claim is OrClaim<any> => isObject(claim) && 'or' in claim
