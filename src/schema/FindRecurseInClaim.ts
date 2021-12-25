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
    LabelClaim,
    RecurseClaim,
} from './claims'

export type FindRecurseInClaim<C extends Claim> =
    [C] extends [ConstantClaim<any>] ? never :
    [C] extends [NumberRangeClaim] ? never :
    [C] extends [IntegerClaim] ? never :
    [C] extends [StringRangeClaim] ? never :
    [C] extends [BooleanClaim] ? never :
    [C] extends [ArrayClaim<infer C2>] ? FindRecurseInClaim<C2> :
    [C] extends [TupleClaim<infer Cs>] ? FindRecurseInTuple<Cs> :
    [C] extends [FieldsClaim<infer Fields>] ? FindResurceInFields<Fields> :
    [C] extends [BrandClaim<any>] ? never :
    [C] extends [InstanceOfClaim<any>] ? never :
    [C] extends [AndClaim<infer Cs>] ? FindRecurseInTuple<Cs> :
    [C] extends [OrClaim<infer Cs>] ? FindRecurseInTuple<Cs> :
    [C] extends [NotClaim<infer C>] ? FindRecurseInClaim<C> :
    [C] extends [LabelClaim<infer L2, infer C2>] ? FindRecurseInClaim<C2> :
    [C] extends [RecurseClaim<infer RL>] ? RL :
    never

// prettier-ignore
type FindResurceInFields<Fields extends [string, Claim][]> =
    Fields extends [[infer K, infer C], ...infer FieldsRest] ? C extends Claim ? FieldsRest extends [string, Claim][] ?
    FindRecurseInClaim<C> | FindResurceInFields<FieldsRest> : never : never : never

// prettier-ignore
type FindRecurseInTuple<Cs extends Claim[]> =
    Cs extends [infer C1, ...infer Cs] ? C1 extends Claim ? Cs extends Claim[] ?
    FindRecurseInClaim<C1> | FindRecurseInTuple<Cs> : never : never : never
