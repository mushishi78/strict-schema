import { assert, Equals } from 'tsafe'
import { FindReferencesInClaim } from './FindReferencesInClaim'

import {
  array,
  boolean,
  brand,
  constant,
  field,
  fields,
  instanceOf,
  integer,
  numberRange,
  indexedReference,
  stringRange,
  tuple,
  fieldReference
} from './claims'

{
  const claim = constant(256)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = numberRange([0, '< n <', 10])
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = stringRange([0, 10])
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = brand<{ __brand: 'piston' }>()
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(indexedReference('node'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer, integer)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer, indexedReference('node'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(indexedReference('node'), integer, indexedReference('pilot'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = 'node' | 'pilot'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(fieldReference('a', 'node'), field('b', integer))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a', integer), fieldReference('b', 'pilot'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = 'pilot'
  assert<Equals<Actual, Expected>>()
}
{
  // prettier-ignore
  const claim = fields(
    field('a', integer),
    field('b', fields(
      field('bi', stringRange([0, 10])),
      fieldReference('bii', 'node'))
    )
  )
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = 'node'
  assert<Equals<Actual, Expected>>()
}
