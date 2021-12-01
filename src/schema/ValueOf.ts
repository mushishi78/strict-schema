import { Unite } from 'tsafe/tools/Unite'

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
} from './claims'

// prettier-ignore
export type ValueOfClaim<C extends Claim> =
    C extends ConstantClaim<infer Constant> ? Constant :
    C extends NumberRangeClaim ? number :
    C extends IntegerClaim ? number :
    C extends StringRangeClaim ? string :
    C extends BooleanClaim ? boolean :
    C extends ArrayClaim<infer C2> ? ValueOfClaim<C2>[] :
    C extends TupleClaim<infer Cs> ? ValueOfTuple<Cs> :
    C extends FieldsClaim<infer Fields> ? Unite<ValueOfFields<Fields>> :
    C extends BrandClaim<infer Brand> ? Brand :
    C extends InstanceOfClaim<infer Constructor> ? InstanceType<Constructor> :
    C extends AndClaim<infer Cs> ? ValueOfIntersection<Cs> :
    C extends OrClaim<infer Cs> ? ValueOfClaim<Cs[number]> :
    C extends NotClaim<infer C> ? ValueOfClaim<C> :
    never

// prettier-ignore
type ValueOfTuple<Cs extends Claim[]> =
    Cs extends [infer C1, ...infer Cs] ? C1 extends Claim ? Cs extends Claim[] ?
        [ValueOfClaim<C1>, ...ValueOfTuple<Cs>]: [] : [] : []

// prettier-ignore
type ValueOfFields<Fields extends [string, Claim][]> =
    Fields extends [infer Field, ...infer FieldsRest] ? Field extends [string, Claim] ? FieldsRest extends [string, Claim][] ?
        ValueOfField<Field> & ValueOfFields<FieldsRest> : {} : {} : {}

// prettier-ignore
type ValueOfField<Field extends [string, Claim]> =
    Field extends [`${infer Key}?`, infer C2] ? C2 extends Claim ?
        { [k in Key]?: ValueOfClaim<C2> } : {}

    : Field extends [infer Key, infer C2] ? Key extends string ? C2 extends Claim ?
        { [k in Key]: ValueOfClaim<C2> } : {} : {} : {}

// prettier-ignore
type ValueOfIntersection<Cs extends Claim[]> =
    Cs extends [infer C1, ...infer Cs] ? C1 extends Claim ? Cs extends Claim[] ?
        ValueOfClaim<C1> & ValueOfIntersection<Cs> : {} : {} : {}
