export function isNever(_: never): void {}

export type TypeError<Error extends any[]> = { error: Error }

export type Constructor = new (...args: any) => any
