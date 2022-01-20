import { TypeError } from '../lib/type-helpers'
import {
  Claim,
  ConstantClaim,
  NumberClaim,
  IntegerClaim,
  StringClaim,
  BooleanClaim,
  ArrayClaim,
  TupleClaim,
  FieldsClaim,
  BrandClaim,
  InstanceOfClaim,
  OrClaim,
  IndexedReference,
  IndexedClaim,
  Field,
  FieldReference,
  UuidClaim,
  DateStringClaim,
  UnknownClaim,
  NeverClaim,
} from './claims'

export type ReferenceLookup<C extends Claim> = LookupFromReferenceTuple<FindReferencesInClaim<C>>

// prettier-ignore
type LookupFromReferenceTuple<Rs> =
  Rs extends [infer R, ...infer Rest] ? LookupFromReference<R> & LookupFromReferenceTuple<Rest> : {}

// prettier-ignore
type LookupFromReference<R> =
  R extends IndexedReference<infer Ref> ? { [r in Ref]: any } :
  R extends FieldReference<`${infer Key}?`, infer Ref> ? { [r in Ref]: { [k in Key]?: any } } :
  R extends FieldReference<`${infer Key}`, infer Ref> ? { [r in Ref]: { [k in Key]: any } } :
  {}

// prettier-ignore
export type FindReferencesInClaim<C extends Claim> =
  [C] extends [ConstantClaim<any>] ? [] :
  [C] extends [NumberClaim] ? [] :
  [C] extends [IntegerClaim] ? [] :
  [C] extends [StringClaim] ? [] :
  [C] extends [UuidClaim] ? [] :
  [C] extends [DateStringClaim] ? [] :
  [C] extends [BooleanClaim] ? [] :
  [C] extends [UnknownClaim] ? [] :
  [C] extends [NeverClaim] ? [] :
  [C] extends [ArrayClaim<infer C2>] ? FindReferencesInIndexedClaim<C2> :
  [C] extends [TupleClaim<infer Cs>] ? FindReferencesInTuple<Cs> :
  [C] extends [FieldsClaim<infer Fields>] ? FindReferencesInFields<Fields> :
  [C] extends [BrandClaim<any, infer C2>] ? FindReferencesInClaim<C2> :
  [C] extends [InstanceOfClaim<any>] ? [] :
  [C] extends [OrClaim<infer Cs>] ? FindReferencesInTuple<Cs> :
  [TypeError<['FindReferencesInClaim', 'Unrecognized claim', C]>]

// prettier-ignore
type FindReferencesInIndexedClaim<C extends IndexedClaim> =
  C extends IndexedReference<string> ? [C] :
  C extends Claim ? FindReferencesInClaim<C> :
  [TypeError<['FindReferencesInIndexedClaim', 'Unrecognized claim or reference', C]>]

// prettier-ignore
type FindReferencesInFields<Fields extends Field[]> =
  Fields extends [infer F, ...infer Fs] ? F extends Field ? Fs extends Field[] ?
    [...FindReferencesInField<F>, ...FindReferencesInFields<Fs>] : [] : [] :
  []

// prettier-ignore
type FindReferencesInField<F extends Field> =
  F extends FieldReference<string, string> ? [F] :
  F extends [infer K, infer C] ? C extends Claim ?
    FindReferencesInClaim<C> : [] :
  [TypeError<['FindReferencesInFields', 'unrecognized field', F]>]

// prettier-ignore
type FindReferencesInTuple<Cs extends IndexedClaim[]> =
  Cs extends [infer C1, ...infer Cs] ? C1 extends IndexedClaim ? Cs extends IndexedClaim[] ?
    [...FindReferencesInIndexedClaim<C1>, ...FindReferencesInTuple<Cs>]: [] : [] :
  []
