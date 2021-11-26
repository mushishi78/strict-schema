export function tuple<T extends any[]>(...values: T): T {
  return values
}

export function isNever(_: never): void {}

// prettier-ignore
export type _Combinations<List extends any[], Count extends any[] = List> =
  Count extends [infer C1, ...infer Cs] ?
    List extends [infer L1, ...infer Ls] ?
      | [L1, ...Ls]
      | [...Ls, L1]
      | _Combinations<[...Ls, L1], Cs>
      | [L1, ..._Combinations<Ls, Cs>]
      | [..._Combinations<Ls, Cs>, L1]
    : never
  : never
