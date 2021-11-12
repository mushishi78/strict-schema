import { Failure, noFailures, oneFailure } from "../lib/failure";

export function checkForNullOrUndefined<T, FailureType extends string>(
  allow: Array<T | null | undefined>,
  value: unknown,
  callback: () => Failure<FailureType>[]
): Failure<FailureType | "unexpected-null" | "unexpected-undefined">[] {
  if (value === null) {
    if (allow.includes(null)) return noFailures();
    return oneFailure("unexpected-null", `Expected number, got null`);
  }

  if (value === undefined) {
    if (allow.includes(undefined)) return noFailures();
    return oneFailure("unexpected-undefined", `Expected number, got undefined`);
  }

  return callback();
}
