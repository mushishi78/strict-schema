import { Equals } from 'tsafe'
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
    AndCombiniations,
} from './claims'

export type ReplaceRecurseInClaim<C extends Claim, L extends string, CR extends Claim> =
    [C] extends [ConstantClaim<any>] ? C :
    [C] extends [NumberRangeClaim] ? C :
    [C] extends [IntegerClaim] ? C :
    [C] extends [StringRangeClaim] ? C :
    [C] extends [BooleanClaim] ? C :
    [C] extends [ArrayClaim<infer C2>] ? ArrayClaim<CastToClaim<ReplaceRecurseInClaim<C2, L, CR>>> :
    [C] extends [TupleClaim<infer Cs>] ? TupleClaim<ReplaceRecurseInTuple<Cs, L, CR>> :
    [C] extends [FieldsClaim<infer Fields>] ? FieldsClaim<ReplaceRecurseInFields<Fields, L, CR>> :
    [C] extends [BrandClaim<any>] ? C :
    [C] extends [InstanceOfClaim<any>] ? C :
    [C] extends [AndClaim<infer Cs>] ? AndClaim<CastToAndCombiniations<ReplaceRecurseInTuple<Cs, L, CR>>> :
    [C] extends [OrClaim<infer Cs>] ? OrClaim<ReplaceRecurseInTuple<Cs, L, CR>> :
    [C] extends [NotClaim<infer C>] ? NotClaim<ReplaceRecurseInClaim<C, L, CR>> :
    [C] extends [LabelClaim<infer L2, infer C2>] ? LabelClaim<L2, ReplaceRecurseInClaim<C2, L, CR>> :
    [C] extends [RecurseClaim<infer RL>] ? true extends Equals<L, RL> ? CR : C :
    never

type CastToClaim<C> = C extends Claim ? C : never
type CastToAndCombiniations<C> = C extends AndCombiniations ? C : never

// prettier-ignore
type ReplaceRecurseInFields<Fields extends [string, Claim][], L extends string, CR extends Claim> =
    Fields extends [[infer K, infer C], ...infer FieldsRest] ? C extends Claim ? FieldsRest extends [string, Claim][] ?
    [[K, ReplaceRecurseInClaim<C, L, CR>], ...ReplaceRecurseInFields<FieldsRest, L, CR>] : [] : [] : []

// prettier-ignore
type ReplaceRecurseInTuple<Cs extends Claim[], L extends string, CR extends Claim> =
    Cs extends [infer C1, ...infer Cs] ? C1 extends Claim ? Cs extends Claim[] ?
    [ReplaceRecurseInClaim<C1, L, CR>, ...ReplaceRecurseInTuple<Cs, L, CR>] : [] : [] : []
