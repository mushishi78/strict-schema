import { isObject } from 'remeda'
import { NumberRange } from '../lib/number-range'
import { StringRange } from '../lib/string-range'
import { _Combinations } from '../lib/type-helpers'

export type Claim =
  | ConstantClaim<any>
  | NumberRangeClaim
  | IntegerClaim
  | StringRangeClaim
  | BooleanClaim
  | ArrayClaim<any>
  | TupleClaim<any>
  | FieldsClaim<any>
  | BrandClaim<any>
  | InstanceOfClaim<any>
  | AndClaim<any>
  | OrClaim<any>
  | NotClaim<any>

type ContantTypes = string | number | boolean | null | undefined | object | Array<any>
export type ConstantClaim<T extends ContantTypes> = { constant: T }
export const constant = <T extends ContantTypes>(constant: T): ConstantClaim<T> => ({ constant })
export const isConstantClaim = (claim: unknown): claim is ConstantClaim<ContantTypes> =>
  isObject(claim) && 'constant' in claim

export type NumberRangeClaim = { numberRange: NumberRange }
export const numberRange = (numberRange: NumberRange): NumberRangeClaim => ({ numberRange })
export const isNumberRangeClaim = (claim: unknown): claim is NumberRangeClaim =>
  isObject(claim) && 'numberRange' in claim

export type IntegerClaim = 'Integer'
export const integer: IntegerClaim = 'Integer'
export const isIntegerClaim = (claim: unknown): claim is IntegerClaim => claim === 'Integer'

export type StringRangeClaim = { stringRange: StringRange }
export const stringRange = (stringRange: StringRange): StringRangeClaim => ({ stringRange })
export const isStringRangeClaim = (claim: unknown): claim is StringRangeClaim =>
  isObject(claim) && 'stringRange' in claim

export type BooleanClaim = 'Boolean'
export const boolean: BooleanClaim = 'Boolean'
export const isBooleanClaim = (claim: unknown): claim is BooleanClaim => claim === 'Boolean'

export type ArrayClaim<C extends Claim> = { array: C }
export const array = <C extends Claim>(claim: C): ArrayClaim<C> => ({ array: claim })
export const isArrayClaim = (claim: unknown): claim is ArrayClaim<any> => isObject(claim) && 'array' in claim

export type TupleClaim<Cs extends Claim[]> = { tuple: Cs }
export const tuple = <Cs extends Claim[]>(...claims: Cs): TupleClaim<Cs> => ({ tuple: claims })
export const isTupleClaim = (claim: unknown): claim is TupleClaim<any> => isObject(claim) && 'tuple' in claim

export type FieldsClaim<Fs extends [string, Claim][]> = { fields: Fs; exclusive: boolean }
export const field = <K extends string, C extends Claim>(key: K, claim: C): [K, C] => [key, claim]
export const fields = <Fs extends [string, Claim][]>(...fields: Fs): FieldsClaim<Fs> => ({ fields, exclusive: false })
export const exclusiveFields = <Fs extends [[string, Claim]]>(...fields: Fs): FieldsClaim<Fs> => ({
  fields,
  exclusive: true,
})
export const isFieldsClaim = (claim: unknown): claim is FieldsClaim<any> => isObject(claim) && 'fields' in claim

export type BrandClaim<Brand = never> = { brand: true }
export const brand = <Brand = never>(): BrandClaim<Brand> => ({ brand: true })
export const isBrandClaim = (claim: unknown): claim is BrandClaim<any> => isObject(claim) && 'brand' in claim

type Constructor = new (...args: any) => any
export type InstanceOfClaim<C extends Constructor = never> = { instanceOf: C }
export const instanceOf = <C extends Constructor = never>(instanceOf: C): InstanceOfClaim<C> => ({
  instanceOf,
})
export const isInstanceOfClaim = (claim: unknown): claim is InstanceOfClaim<any> =>
  isObject(claim) && 'instanceOf' in claim

export type AndCombiniations =
  | _Combinations<[IntegerClaim, NumberRangeClaim]>
  | _Combinations<[IntegerClaim, NumberRangeClaim, BrandClaim<any>]>
  | _Combinations<[BrandClaim<any>, Exclude<Claim, BrandClaim<any>>]>

export type AndClaim<Cs extends AndCombiniations> = { and: Cs }
export const and = <Cs extends AndCombiniations>(...and: Cs) => ({ and })
export const isAndClaim = (claim: unknown): claim is AndClaim<any> => isObject(claim) && 'and' in claim

export type OrClaim<Cs extends Claim[]> = { or: Cs }
export const or = <Cs extends Claim[]>(...or: Cs) => ({ or })
export const isOrClaim = (claim: unknown): claim is OrClaim<any> => isObject(claim) && 'or' in claim

export type NotClaim<C extends Claim> = { not: C }
export const not = <C extends Claim>(not: C) => ({ not })
export const isNotClaim = (claim: unknown): claim is NotClaim<any> => isObject(claim) && 'not' in claim
