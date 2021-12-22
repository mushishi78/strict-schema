import { assert, Equals } from 'tsafe'

import {
  NotInteger,
  indexedFailures,
  notInteger,
  failureAtIndex,
  unexpectedTypeOf,
  IndexedFailures,
  UnexpectedTypeOf,
} from './validation'

{
  const f = indexedFailures([
    failureAtIndex(0, notInteger(34.3)), //
    failureAtIndex(1, unexpectedTypeOf('number', '20')),
  ])
  type Actual = typeof f
  type Expected = IndexedFailures<NotInteger | UnexpectedTypeOf>
  assert<Equals<Actual, Expected>>()
}

{
  const f = indexedFailures([
    failureAtIndex(
      27,
      indexedFailures([
        failureAtIndex(0, notInteger(34.3)), //
        failureAtIndex(1, unexpectedTypeOf('number', '20')),
      ])
    ),
  ])
  type Actual = typeof f
  type Expected = IndexedFailures<IndexedFailures<NotInteger | UnexpectedTypeOf>>
  assert<Equals<Actual, Expected>>()
}
