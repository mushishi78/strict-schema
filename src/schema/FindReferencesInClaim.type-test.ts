import { assert, Equals } from 'tsafe'
import { FindReferencesInClaim, ReferenceLookup } from './FindReferencesInClaim'

import {
  array,
  boolean,
  brand,
  constant,
  field,
  fields,
  instanceOf,
  integer,
  number,
  indexedReference,
  string,
  tuple,
  fieldReference,
  IndexedReference,
  FieldReference,
  uuid,
  dateString,
  unknown,
  never,
} from './claims'

{
  const claim = constant(256)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = number([0, '< n <', 10])
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer()
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = string(0, 10)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = uuid()
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = dateString()
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = unknown
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = never
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = brand<{ __brand: 'piston' }>()(boolean)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(indexedReference('node'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = [IndexedReference<'node'>]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer(), integer())
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = []
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer(), indexedReference('node'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = [IndexedReference<'node'>]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(indexedReference('node'), integer(), indexedReference('pilot'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = [IndexedReference<'node'>, IndexedReference<'pilot'>]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(fieldReference('a', 'node'), field('b', integer()))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = [FieldReference<'a', 'node'>]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('a', integer()), fieldReference('b', 'pilot'))
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = [FieldReference<'b', 'pilot'>]
  assert<Equals<Actual, Expected>>()
}
{
  // prettier-ignore
  const claim = fields(
    field('a', integer()),
    field('b', fields(
      field('bi', string()),
      fieldReference('bii?', 'node'))
    )
  )
  type Actual = FindReferencesInClaim<typeof claim>
  type Expected = [FieldReference<'bii?', 'node'>]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer(), integer())
  type Actual = ReferenceLookup<typeof claim>
  type Expected = {}
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(integer(), indexedReference('node'))
  type Actual = ReferenceLookup<typeof claim>
  type Expected = { node: any }
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(indexedReference('node'), integer(), indexedReference('pilot'))
  type Actual = ReferenceLookup<typeof claim>
  type Expected = { node: any; pilot: any }
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(fieldReference('a', 'node'), field('b', integer()), fieldReference('b?', 'pilot'))
  type Actual = ReferenceLookup<typeof claim>
  type Expected = { node: { a: any }; pilot: { b?: any } }
  assert<Equals<Actual, Expected>>()
}
