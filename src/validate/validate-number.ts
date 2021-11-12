import { Failure, noFailures, oneFailure, addFailure } from "../lib/failure";
import { areNumbersEqual } from "../lib/number";
import { isInNumberRange, NumberRange } from "../lib/number-range";
import { NumberSchema } from "../schema/number-schema";
import { checkForNullOrUndefined } from "./validate-helpers";

export type NumberFailureType =
  | "unexpected-null"
  | "unexpected-undefined"
  | "expected-number"
  | "expected-integer"
  | "not-allowed";

export function validateNumber(
  schema: NumberSchema,
  value: unknown
): Failure<NumberFailureType>[] {
  const { allow, mustBeInteger } = schema.properties;

  return checkForNullOrUndefined(allow, value, () => {
    if (typeof value !== "number") {
      return oneFailure("expected-number", `Expected ${value} to be a number`);
    }

    let failures = noFailures<NumberFailureType>();

    if (mustBeInteger && !Number.isInteger(value)) {
      const message = `Expected ${value} to be an integer`;
      failures = addFailure(failures, "expected-integer", message);
    }

    if (allow.length > 0 && !isIn(allow, value)) {
      const message = `Number ${value} is not in: ${allow}`;
      failures = addFailure(failures, "not-allowed", message);
    }

    return failures;
  });
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
