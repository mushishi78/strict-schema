import { ValueOfClaim } from './ValueOf'
import { assert, Equals } from 'tsafe'

import {
  and,
  array,
  boolean,
  brand,
  constant,
  field,
  fields,
  instanceOf,
  integer,
  not,
  numberRange,
  or,
  stringRange,
  tuple,
} from './claims'

type FileBrand = { readonly __brand: unique symbol }

{
  const claim = constant(256)
  type Actual = ValueOfClaim<typeof claim>
  type Expected = 256
  assert<Equals<Actual, Expected>>()
}
{
  const claim = numberRange([34, '< n <', 0])
  type Actual = ValueOfClaim<typeof claim>
  type Expected = number
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer
  type Actual = ValueOfClaim<typeof claim>
  type Expected = number
  assert<Equals<Actual, Expected>>()
}
{
  const claim = stringRange([0, 10])
  type Actual = ValueOfClaim<typeof claim>
  type Expected = string
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = ValueOfClaim<typeof claim>
  type Expected = boolean
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(boolean)
  type Actual = ValueOfClaim<typeof claim>
  type Expected = boolean[]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(boolean, integer)
  type Actual = ValueOfClaim<typeof claim>
  type Expected = [boolean, number]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('foo', integer), field('bar?', boolean))
  type Actual = ValueOfClaim<typeof claim>
  type Expected = { foo: number; bar?: boolean }
  assert<Equals<Actual, Expected>>()
}
{
  const claim = brand<FileBrand>()
  type Actual = ValueOfClaim<typeof claim>
  type Expected = FileBrand
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = ValueOfClaim<typeof claim>
  type Expected = Date
  assert<Equals<Actual, Expected>>()
}
{
  const claim = and(integer, brand<FileBrand>())
  type Actual = ValueOfClaim<typeof claim>
  type Expected = number & FileBrand
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(integer, boolean)
  type Actual = ValueOfClaim<typeof claim>
  type Expected = number | boolean
  assert<Equals<Actual, Expected>>()
}
{
  const claim = not(numberRange([0, '< n <', 100]))
  type Actual = ValueOfClaim<typeof claim>
  type Expected = number
  assert<Equals<Actual, Expected>>()
}

{
  //prettier-ignore
  const claim = fields(
    field('foo', integer),
    field('bar?', boolean),
    field('nested', fields(
      field('chew', or(integer, boolean)),
      field('lick?', constant(null))
    )))

  type Actual = ValueOfClaim<typeof claim>
  type Expected = {
    foo: number
    bar?: boolean
    nested: {
      chew: number | boolean
      lick?: null
    }
  }
  assert<Equals<Actual, Expected>>()
}
