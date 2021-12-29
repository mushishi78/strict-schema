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
    FieldReference
} from './claims'

export type FindReferencesInClaim<C extends Claim> =
    [C] extends [ConstantClaim<any>] ? never :
    [C] extends [NumberRangeClaim] ? never :
    [C] extends [IntegerClaim] ? never :
    [C] extends [StringRangeClaim] ? never :
    [C] extends [BooleanClaim] ? never :
    [C] extends [ArrayClaim<infer C2>] ? FindReferencesInIndexedClaim<C2> :
    [C] extends [TupleClaim<infer Cs>] ? FindReferencesInTuple<Cs> :
    [C] extends [FieldsClaim<infer Fields>] ? FindReferencesInFields<Fields> :
    [C] extends [BrandClaim<any>] ? never :
    [C] extends [InstanceOfClaim<any>] ? never :
    [C] extends [AndClaim<infer Cs>] ? FindReferencesInTuple<Cs> :
    [C] extends [OrClaim<infer Cs>] ? FindReferencesInTuple<Cs> :
    [C] extends [NotClaim<infer C>] ? FindReferencesInClaim<C> :
    { error: ['FindReferencesInClaim', 'Unrecognized claim', C] }

type FindReferencesInIndexedClaim<C extends IndexedClaim> =
    C extends IndexedReference<infer Ref> ? Ref :
    C extends Claim ? FindReferencesInClaim<C> :
    { error: ['FindReferencesInIndexedClaim', 'Unrecognized claim or reference', C] }

// prettier-ignore
type FindReferencesInFields<Fields extends Field[]> =
    Fields extends [infer F, ...infer Fs] ? F extends Field ? Fs extends Field[] ?
    FindReferencesInField<F> | FindReferencesInFields<Fs> : never : never : never

// prettier-ignore
type FindReferencesInField<F extends Field> =
    F extends FieldReference<infer K, infer R> ? R :
    F extends [infer K, infer C] ? C extends Claim ? FindReferencesInClaim<C> : never :
    { error: ['FindReferencesInFields', 'unrecognized field', F] }

// prettier-ignore
type FindReferencesInTuple<Cs extends IndexedClaim[]> =
    Cs extends [infer C1, ...infer Cs] ? C1 extends IndexedClaim ? Cs extends IndexedClaim[] ?
    FindReferencesInIndexedClaim<C1> | FindReferencesInTuple<Cs> : never : never : never
