import { assert, Equals } from 'tsafe'

import {
  array,
  boolean,
  constant,
  discriminantField,
  field,
  fieldReference,
  record,
  indexedReference,
  instanceOf,
  integer,
  number,
  optionalField,
  optionalFieldReference,
  string,
  tuple,
  or,
  brand,
  uuid,
  unknown,
  never,
  dateString,
} from './claims'
import { pick } from './combinators'

{
  const r = record(field('a', number()), field('b', boolean), field('c', string()))
  const r2 = pick(r, 'a', 'c')
  const expected = record(field('a', number()), field('c', string()))
  type Actual = typeof r2
  type Expected = typeof expected
  assert<Equals<Actual, Expected>>()
}
