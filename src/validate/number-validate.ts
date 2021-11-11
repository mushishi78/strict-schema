import { Failure, noFailures, oneFailure, addFailure } from "../lib/failure";
import { areNumbersEqual } from "../lib/number";
import { isInNumberRange, NumberRange } from "../lib/number-range";
import { NumberSchema } from "../schema/number-schema";

export type NumberFailureType =
  | "unexpected-null"
  | "unexpected-undefined"
  | "expected-number"
  | "expected-integer"
  | "not-allowed";

export function validateNumber(
  schema: NumberSchema,
  json: unknown
): Failure<NumberFailureType>[] {
  if (json === null) {
    if (schema.properties.allow.includes(null)) return noFailures();
    return oneFailure("unexpected-null", `Expected number, got null`);
  }

  if (json === undefined) {
    if (schema.properties.allow.includes(undefined)) return noFailures();
    return oneFailure("unexpected-undefined", `Expected number, got undefined`);
  }

  if (typeof json !== "number") {
    return oneFailure("expected-number", `Expected ${json} to be a number`);
  }

  let failures = noFailures<NumberFailureType>();

  if (schema.properties.mustBeInteger && !Number.isInteger(json)) {
    const message = `Expected ${json} to be an integer`;
    failures = addFailure(failures, "expected-integer", message);
  }

  if (
    schema.properties.allow.length > 0 &&
    !isIn(schema.properties.allow, json)
  ) {
    const message = `Number ${json} is not in: ${schema.properties.allow}`;
    failures = addFailure(failures, "not-allowed", message);
  }

  return failures;
}

function isIn(
  list: Array<number | NumberRange | null | undefined>,
  num: number
) {
  for (const member of list) {
    if (member == null) continue;

    if (typeof member === "number") {
      if (areNumbersEqual(member, num)) return true;
    } else {
      if (isInNumberRange(member, num)) return true;
    }
  }

  return false;
}
