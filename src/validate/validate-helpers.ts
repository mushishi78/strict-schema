import { Failure, noFailures, oneFailure } from "../lib/failure";

export function checkForNullOrUndefined<T, FailureType extends string>(
  allow: Array<T | null | undefined>,
  json: unknown,
  callback: () => Failure<FailureType>[]
): Failure<FailureType | "unexpected-null" | "unexpected-undefined">[] {
  if (json === null) {
    if (allow.includes(null)) return noFailures();
    return oneFailure("unexpected-null", `Expected number, got null`);
  }

  if (json === undefined) {
    if (allow.includes(undefined)) return noFailures();
    return oneFailure("unexpected-undefined", `Expected number, got undefined`);
  }

  return callback();
}
