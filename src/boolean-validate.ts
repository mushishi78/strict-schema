import { Failure, noFailures, oneFailure, addFailure } from "./failure";
import { BooleanSchema } from "./boolean-schema";

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
    if (allow.indexOf(null) >= 0) return noFailures();

    return oneFailure("unexpected-null", `Expected boolean, got null`);
  }

  if (json === undefined) {
    if (allow.indexOf(undefined) >= 0) return noFailures();

    return oneFailure(
      "unexpected-undefined",
      `Expected boolean, got undefined`
    );
  }

  if (typeof json !== "boolean") {
    return oneFailure("expected-boolean", `Expected ${json} to be a boolean`);
  }

  let failures = noFailures<BooleanFailureType>();

  if (allow.length > 0 && allow.indexOf(json) === -1) {
    const message = `Boolean ${json} is not in: ${allow}`;
    failures = addFailure(failures, "not-allowed", message);
  }

  return failures;
}
