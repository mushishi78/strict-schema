import { Field, RecordClaim } from '.'
import { Claim, constant, or } from './claims'
import { getFieldKey } from './lib/field'
import { FieldNames, PickFields } from './type/FieldNames'

export function pick<Fs extends Field[], K extends FieldNames<Fs>>(
  c: RecordClaim<Fs>,
  ...keys: K[]
): RecordClaim<PickFields<Fs, K>> {
  return {
    record: {
      fields: c.record.fields.filter((f) => keys.includes(getFieldKey(f) as K)) as PickFields<Fs, K>,
      exclusive: c.record.exclusive,
    },
  }
}

export function merge<A extends Field[], B extends Field[]>(
  a: RecordClaim<A>,
  b: RecordClaim<B>
): RecordClaim<[...A, ...B]> {
  return {
    record: {
      fields: [...a.record.fields, ...b.record.fields],
      exclusive: b.record.exclusive,
    },
  }
}

export function nullable<C extends Claim>(claim: C) {
  return or(claim, constant(null))
}
