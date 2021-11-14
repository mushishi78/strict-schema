import {
  Failure,
  multipleFailures,
  MultipleFailures,
  notAllowed,
  Valid,
  valid,
} from "./failure";

export function allowIncludes(allow: unknown[], value: unknown) {
  return allow.includes(value) ? valid : notAllowed(allow, value);
}

export const collectFailures = <Failures extends Array<Failure<string>>>(
  ...failures: Failures
):
  | Failures[number]
  | Valid
  | MultipleFailures<Exclude<Failures[number], Valid>> => {
  const actualFailures = failures.filter((f) => f.failureType !== "Valid");

  if (actualFailures.length === 0) return valid;
  if (actualFailures.length === 1) return actualFailures[0];

  return multipleFailures(...failures);
};
