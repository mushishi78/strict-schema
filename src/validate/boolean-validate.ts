import { Failure, noFailures, oneFailure, addFailure } from "../lib/failure";
import { BooleanSchema } from "../schema/boolean-schema";

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

  if (json === null) {
    if (allow.includes(null)) return noFailures();

    return oneFailure("unexpected-null", `Expected boolean, got null`);
  }

  if (json === undefined) {
    if (allow.includes(undefined)) return noFailures();

    return oneFailure(
      "unexpected-undefined",
      `Expected boolean, got undefined`
    );
  }

  if (typeof json !== "boolean") {
    return oneFailure("expected-boolean", `Expected ${json} to be a boolean`);
  }

  let failures = noFailures<BooleanFailureType>();

  if (allow.length > 0 && !allow.includes(json)) {
    const message = `Boolean ${json} is not in: ${allow}`;
    failures = addFailure(failures, "not-allowed", message);
  }

  return failures;
}
