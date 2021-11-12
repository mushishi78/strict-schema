import { Failure, noFailures, oneFailure, addFailure } from "../lib/failure";
import { BooleanSchema } from "../schema/boolean-schema";
import { checkForNullOrUndefined } from "./validate-helpers";

export type BooleanFailureType =
  | "unexpected-null"
  | "unexpected-undefined"
  | "expected-boolean"
  | "not-allowed";

export function validateBoolean(
  schema: BooleanSchema,
  json: unknown
): Failure<BooleanFailureType>[] {
  const { allow } = schema.properties;

  return checkForNullOrUndefined(allow, json, () => {
    if (typeof json !== "boolean") {
      return oneFailure("expected-boolean", `Expected ${json} to be a boolean`);
    }

    let failures = noFailures<BooleanFailureType>();

    if (allow.length > 0 && !allow.includes(json)) {
      const message = `Boolean ${json} is not in: ${allow}`;
      failures = addFailure(failures, "not-allowed", message);
    }

    return failures;
  });
}
