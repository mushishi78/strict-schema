import { Unite } from 'tsafe/tools/Unite'
import { ReferenceLookup } from './FindReferencesInClaim'
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

type References = Record<string, any>

export type ValueOfClaim<C extends Claim, Refs extends ReferenceLookup<C>> = _ValueOfClaim<C, Refs>

// prettier-ignore
type _ValueOfClaim<C extends Claim, Refs extends References> =
  C extends ConstantClaim<infer Constant> ? Constant :
  C extends NumberRangeClaim ? number :
  C extends IntegerClaim ? number :
  C extends StringRangeClaim ? string :
  C extends BooleanClaim ? boolean :
  C extends ArrayClaim<infer C2> ? Array<ValueOfIndexedClaim<C2, Refs>> :
  C extends TupleClaim<infer Cs> ? ValueOfTuple<Cs, Refs> :
  C extends FieldsClaim<infer Fields> ? Unite<ValueOfFields<Fields, Refs>> :
  C extends BrandClaim<infer Brand> ? Brand :
  C extends InstanceOfClaim<infer Constructor> ? InstanceType<Constructor> :
  C extends AndClaim<infer Cs> ? ValueOfIntersection<Cs, Refs> :
  C extends OrClaim<infer Cs> ? _ValueOfClaim<Cs[number], Refs> :
  C extends NotClaim<infer C> ? _ValueOfClaim<C, Refs> :
  TypeError<['ValueOfClaim', 'Unrecognized claim', C]>

// prettier-ignore
type ValueOfIndexedClaim<C extends IndexedClaim, Refs extends References> =
  C extends IndexedReference<infer Reference> ? Refs[Reference] :
  C extends Claim ? _ValueOfClaim<C, Refs> :
  TypeError<['ValueOfIndexedClaim', 'Unrecognized claim', C]>

// prettier-ignore
type ValueOfTuple<Cs extends IndexedClaim[], Refs extends References> =
  Cs extends [infer C1, ...infer Cs] ? C1 extends IndexedClaim ? Cs extends IndexedClaim[] ?
    [ValueOfIndexedClaim<C1, Refs>, ...ValueOfTuple<Cs, Refs>] : [] : [] :
  []

// prettier-ignore
type ValueOfFields<Fields extends Field[], Refs extends References> =
  Fields extends [infer F, ...infer Fs] ? F extends Field ? Fs extends Field[] ?
    ValueOfField<F, Refs> & ValueOfFields<Fs, Refs> : {} : {} :
  {}

// prettier-ignore
type ValueOfField<F extends Field, Refs extends References> =
  F extends FieldReference<infer Key, `${infer Ref}`> ? Refs[Ref] :

  F extends [`${infer Key}?`, infer C2] ? C2 extends Claim ?
    { [k in Key]?: _ValueOfClaim<C2, Refs> } :
    TypeError<['ValueOfField', 'Unrecognized value in field', C2]> :

  F extends [`${infer Key}`, infer C2] ? C2 extends Claim ?
    { [k in Key]: _ValueOfClaim<C2, Refs> } :
    TypeError<['ValueOfField', 'Unrecognized value in field', C2]> :

  TypeError<['ValueOfField', 'Unrecognized field', F]>

// prettier-ignore
type ValueOfIntersection<Cs extends Claim[], Refs extends References> =
  Cs extends [infer C1, ...infer Cs] ? C1 extends Claim ? Cs extends Claim[] ?
    _ValueOfClaim<C1, Refs> & ValueOfIntersection<Cs, Refs> : {} : {} :
  {}
