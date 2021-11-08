import { Failure, noFailures, oneFailure, addFailure } from "./failure";
import { areNumbersEqual } from "./number";
import { isInNumberRange, NumberRange } from "./number-range";
import { NumberSchema } from "./number-schema";

export type NumberFailureType =
  | "unexpected-null"
  | "unexpected-undefined"
  | "expected-number"
  | "expected-integer"
  | "not-allowed"
  | "value-excluded";

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
    schema.properties.allow.length > 0 &&
    !isIn(schema.properties.allow, json)
  ) {
    const message = `Number ${json} is not in: ${schema.properties.allow}`;
    failures = addFailure(failures, "not-allowed", message);
  }

  if (
    schema.properties.exclude.length > 0 &&
    isIn(schema.properties.exclude, json)
  ) {
    const message = `Number ${json} has been exluded. Excluded values: ${schema.properties.exclude}`;
    failures = addFailure(failures, "value-excluded", message);
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