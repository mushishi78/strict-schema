export function tuple<T extends any[]>(...values: T): T {
  return values
}

export function isNever(_: never): void {}

export type TypeError<Error extends any[]> = { error: Error }
