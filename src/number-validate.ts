import { Failure, noFailures, oneFailure, addFailure } from "./failure";
import { areNumbersEqual } from "./number";
import { isInNumberRange, NumberRange } from "./number-range";
import { NumberSchema } from "./number-schema";

export type NumberFailureType =
  | "unexpected-null"
  | "unexpected-undefined"
  | "expected-number"
  | "expected-integer"
  | "expected-include"
  | "expected-exclude";

export function validateNumber(
  schema: NumberSchema,
  json: unknown
): Failure<NumberFailureType>[] {
  if (json === null) {
    return oneFailure("unexpected-null", `Expected number, got null`);
  }

  if (json === undefined) {
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
    schema.properties.include.length > 0 &&
    !isIn(schema.properties.include, json)
  ) {
    const message = `Expected ${json} to be in included: ${schema.properties.include}`;
    failures = addFailure(failures, "expected-include", message);
  }

  if (
    schema.properties.exclude.length > 0 &&
    isIn(schema.properties.exclude, json)
  ) {
    const message = `Expected ${json} to not be in exluded: ${schema.properties.exclude}`;
    failures = addFailure(failures, "expected-exclude", message);
  }

  return failures;
}

function isIn(list: Array<number | NumberRange>, num: number) {
  for (const member of list) {
    if (typeof member === "number") {
      if (areNumbersEqual(member, num)) return true;
    } else {
      if (isInNumberRange(member, num)) return true;
    }
  }

  return false;
}
