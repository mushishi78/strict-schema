import { assert, Equals } from 'tsafe'
import { ReplaceRecurseInClaim } from './ReplaceRecurseInClaim'

import {
  array,
  boolean,
  brand,
  constant,
  field,
  fields,
  instanceOf,
  integer,
  label,
  not,
  numberRange,
  or,
  recurse,
  stringRange,
  tuple,
} from './claims'

{
  const claim = constant(256)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = numberRange([0, '< n <', 10])
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Boolean'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = stringRange([0, 10])
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = brand<{ __brand: 'piston' }>()
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = recurse('node')
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = 'Integer'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = recurse('node')
  type Actual = ReplaceRecurseInClaim<typeof claim, 'dido', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(recurse('node'))
  const claim2 = array(integer)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer, integer)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer, recurse('node'))
  const claim2 = tuple(integer, integer)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(recurse('node'), integer, recurse('pilot'))
  const claim2 = tuple(integer, integer, recurse('pilot'))
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a', recurse('node')), field('b', integer))
  const claim2 = fields(field('a', integer), field('b', integer))
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a', integer), field('b', recurse('pilot')))
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  // prettier-ignore
  const claim = fields(
    field('a', integer),
    field('b', fields(
      field('bi', stringRange([0, 10])),
      field('bii', recurse('node')))
    )
  )
  const claim2 = fields(
    field('a', integer),
    field('b', fields(
      field('bi', stringRange([0, 10])),
      field('bii', integer))
    )
  )
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(constant(null), recurse('node'))
  const claim2 = or(constant(null), integer)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(recurse('node'), constant(null), recurse('pilot'))
  const claim2 = or(integer, constant(null), recurse('pilot'))
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = not(recurse('node'))
  const claim2 = not(integer)
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
{
  const claim = not(recurse('pilot'))
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim
  assert<Equals<Actual, Expected>>()
}
{
  const claim = label('pilot', tuple(recurse('node'), integer, recurse('pilot')))
  const claim2 = label('pilot', tuple(integer, integer, recurse('pilot')))
  type Actual = ReplaceRecurseInClaim<typeof claim, 'node', 'Integer'>
  type Expected = typeof claim2
  assert<Equals<Actual, Expected>>()
}
