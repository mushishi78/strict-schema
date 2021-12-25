import { assert, Equals } from 'tsafe'
import { FindRecurseInClaim } from './FindRecurseInClaim'

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
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = numberRange([0, '< n <', 10])
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = stringRange([0, 10])
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = brand<{ __brand: 'piston' }>()
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = recurse('node')
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(recurse('node'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer, integer)
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer, recurse('node'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(recurse('node'), integer, recurse('pilot'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node' | 'pilot'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a', recurse('node')), field('b', integer))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a', integer), field('b', recurse('pilot')))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'pilot'
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
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(integer, recurse('node'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(recurse('node'), integer, recurse('pilot'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node' | 'pilot'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = not(recurse('node'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = not(recurse('pilot'))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'pilot'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = label('pilot', tuple(recurse('node'), integer, recurse('pilot')))
  type Actual = FindRecurseInClaim<typeof claim>
  type Expected = 'node' | 'pilot'
  assert<Equals<Actual, Expected>>()
}
