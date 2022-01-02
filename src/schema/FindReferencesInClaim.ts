import { TypeError } from '../lib/type-helpers'
import {
  Claim,
  ConstantClaim,
  NumberRangeClaim,
  IntegerClaim,
  StringRangeClaim,
  BooleanClaim,
  ArrayClaim,
  TupleClaim,
  FieldsClaim,
  BrandClaim,
  InstanceOfClaim,
  AndClaim,
  OrClaim,
  NotClaim,
  IndexedReference,
  IndexedClaim,
  Field,
  FieldReference,
} from './claims'

export type ReferenceLookup<C extends Claim> = LookupFromReferenceTuple<FindReferencesInClaim<C>>

type LookupFromReferenceTuple<Rs> = Rs extends [infer R, ...infer Rest]
  ? LookupFromReference<R> & LookupFromReferenceTuple<Rest>
  : {}

type LookupFromReference<R> = R extends IndexedReference<infer Ref>
  ? { [r in Ref]: any }
  : R extends FieldReference<`${infer Key}?`, infer Ref>
  ? { [r in Ref]: { [k in Key]?: any } }
  : R extends FieldReference<`${infer Key}`, infer Ref>
  ? { [r in Ref]: { [k in Key]: any } }
  : {}

export type FindReferencesInClaim<C extends Claim> = [C] extends [ConstantClaim<any>]
  ? []
  : [C] extends [NumberRangeClaim]
  ? []
  : [C] extends [IntegerClaim]
  ? []
  : [C] extends [StringRangeClaim]
  ? []
  : [C] extends [BooleanClaim]
  ? []
  : [C] extends [ArrayClaim<infer C2>]
  ? FindReferencesInIndexedClaim<C2>
  : [C] extends [TupleClaim<infer Cs>]
  ? FindReferencesInTuple<Cs>
  : [C] extends [FieldsClaim<infer Fields>]
  ? FindReferencesInFields<Fields>
  : [C] extends [BrandClaim<any>]
  ? []
  : [C] extends [InstanceOfClaim<any>]
  ? []
  : [C] extends [AndClaim<infer Cs>]
  ? FindReferencesInTuple<Cs>
  : [C] extends [OrClaim<infer Cs>]
  ? FindReferencesInTuple<Cs>
  : [C] extends [NotClaim<infer C>]
  ? FindReferencesInClaim<C>
  : [TypeError<['FindReferencesInClaim', 'Unrecognized claim', C]>]

type FindReferencesInIndexedClaim<C extends IndexedClaim> = C extends IndexedReference<string>
  ? [C]
  : C extends Claim
  ? FindReferencesInClaim<C>
  : [TypeError<['FindReferencesInIndexedClaim', 'Unrecognized claim or reference', C]>]

// prettier-ignore
type FindReferencesInFields<Fields extends Field[]> =
    Fields extends [infer F, ...infer Fs] ? F extends Field ? Fs extends Field[] ?
    [...FindReferencesInField<F>, ...FindReferencesInFields<Fs>] : [] : [] : []

// prettier-ignore
type FindReferencesInField<F extends Field> =
    F extends FieldReference<string, string> ? [F] :
    F extends [infer K, infer C] ? C extends Claim ? FindReferencesInClaim<C> : [] :
    [TypeError<['FindReferencesInFields', 'unrecognized field', F]>]

// prettier-ignore
type FindReferencesInTuple<Cs extends IndexedClaim[]> =
    Cs extends [infer C1, ...infer Cs] ? C1 extends IndexedClaim ? Cs extends IndexedClaim[] ?
    [...FindReferencesInIndexedClaim<C1>, ...FindReferencesInTuple<Cs>] : [] : [] : []
