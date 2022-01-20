import { ValueOfClaim } from './ValueOf'
import { assert, Equals } from 'tsafe'

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
  or,
  indexedReference,
  string,
  tuple,
  fieldReference,
  uuid,
  dateString,
  unknown,
  never,
} from './claims'

type FileBrand = { readonly __brand: unique symbol }

{
  const claim = constant(256)
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = 256
  assert<Equals<Actual, Expected>>()
}
{
  const claim = number([34, '< n <', 0])
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = number
  assert<Equals<Actual, Expected>>()
}
{
  const claim = integer([34, '< n <', 0])
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = number
  assert<Equals<Actual, Expected>>()
}
{
  const claim = string(0, 10)
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = string
  assert<Equals<Actual, Expected>>()
}
{
  const claim = uuid()
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = string
  assert<Equals<Actual, Expected>>()
}
{
  const claim = dateString()
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = string
  assert<Equals<Actual, Expected>>()
}
{
  const claim = boolean
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = boolean
  assert<Equals<Actual, Expected>>()
}
{
  const claim = unknown
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = unknown
  assert<Equals<Actual, Expected>>()
}
{
  const claim = never
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = never
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(boolean)
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = boolean[]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = tuple(boolean, integer())
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = [boolean, number]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = fields(field('foo', integer()), field('bar?', boolean))
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = { foo: number; bar?: boolean }
  assert<Equals<Actual, Expected>>()
}
{
  const claim = brand<FileBrand>()(integer())
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = FileBrand & number
  assert<Equals<Actual, Expected>>()
}
{
  const claim = instanceOf(Date)
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = Date
  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(integer(), boolean)
  type Actual = ValueOfClaim<typeof claim, {}>
  type Expected = number | boolean
  assert<Equals<Actual, Expected>>()
}
{
  //prettier-ignore
  const claim = fields(
    field('foo', integer()),
    field('bar?', boolean),
    field('nested', fields(
      field('chew', or(integer(), boolean)),
      field('lick?', constant(null))
    )))

  type Actual = ValueOfClaim<typeof claim, {}>
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
{
  const claim = tuple(integer(), indexedReference('node'))
  interface IActual extends Actual {}
  type Actual = ValueOfClaim<typeof claim, { node: IActual }>
  type Expected = [number, Expected]
  assert<Equals<Actual, Expected>>()
}
{
  const claim = array(indexedReference('node'))
  interface IActual extends Actual {}
  type Actual = ValueOfClaim<typeof claim, { node: IActual }>
  type Expected = Expected[]
  assert<Equals<Actual, Expected>>()
}
{
  // prettier-ignore
  const claim = fields(
    field('relations', fields(
      fieldReference('child?', 'childRef'),
      field('count', integer()))))

  interface IActual {
    child?: Actual
  }
  type Actual = ValueOfClaim<typeof claim, { childRef: IActual }>

  interface IExpected {
    child?: Expected
  }
  type Expected = {
    relations: IExpected & { count: number }
  }

  assert<Equals<Actual, Expected>>()
}
{
  const claim = or(
    fields(
      field('type', or(constant('+'), constant('-'))),
      fieldReference('left?', 'left'),
      fieldReference('right?', 'right')
    ),
    fields(field('type', constant('num')))
  )

  interface ActualLeft {
    left?: Actual
  }
  interface ActualRight {
    right?: Actual
  }
  type Actual = ValueOfClaim<typeof claim, { left: ActualLeft; right: ActualRight }>

  interface ExpectedLeft {
    left?: Expected
  }
  interface ExpectedRight {
    right?: Expected
  }
  type Expected = ({ type: '+' | '-' } & ExpectedLeft & ExpectedRight) | { type: 'num' }

  assert<Equals<Actual, Expected>>()
}
{
  const userClaim = fields(field('type', constant('user')), fieldReference('permission', 'permission'))

  const permissionClaim = fields(field('type', constant('permission')), fieldReference('authorizer', 'authorizer'))

  interface IActualPermission {
    permission: ActualPermission
  }
  type ActualUser = ValueOfClaim<typeof userClaim, { permission: IActualPermission }>

  interface IActualAuthorizer {
    authorizer: ActualUser
  }
  type ActualPermission = ValueOfClaim<typeof permissionClaim, { authorizer: IActualAuthorizer }>

  interface IExpectedPermission {
    permission: ExpectedPermission
  }
  interface IExpectedAuthorizer {
    authorizer: ExpectedUser
  }
  type ExpectedUser = { type: 'user' } & IExpectedPermission
  type ExpectedPermission = { type: 'permission' } & IExpectedAuthorizer

  assert<Equals<ActualUser, ExpectedUser>>()
  assert<Equals<ActualPermission, ExpectedPermission>>()
}
