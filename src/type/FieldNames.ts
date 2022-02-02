import {
  Field,
  DiscriminantField,
  FieldReference,
  OptionalField,
  OptionalFieldReference,
  RegularField,
} from '../claims'

// prettier-ignore
export type FieldNames<Fields extends Field[]> =
    Fields extends [infer F, ...infer Fs] ? F extends Field ? Fs extends Field[] ?
        FieldName<F> | FieldNames<Fs> : never : never :
    never

// prettier-ignore
export type FieldName<F extends Field> =
    F extends RegularField<infer Key, infer _> ? Key :
    F extends OptionalField<infer Key, infer _> ? Key :
    F extends DiscriminantField<infer Key, infer _> ? Key :
    F extends FieldReference<infer Key, infer _> ? Key :
    F extends OptionalFieldReference<infer Key, infer _> ? Key :
    never

// prettier-ignore
export type PickFields<Fields extends Field[], Keys extends FieldNames<Fields>> =
    Fields extends [infer F, ...infer Fs] ? F extends Field ? Fs extends Field[] ?
        [FieldName<F> extends Keys ? F : never, ...PickFields<Fs, Keys>] : [] : [] :
    []
