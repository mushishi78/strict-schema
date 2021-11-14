export type Failure<FailureType extends string> = {
  failureType: FailureType;
};

export interface Valid extends Failure<"Valid"> {}
export const valid: Valid = { failureType: "Valid" };

export interface UnexpectedTypeOf extends Failure<"UnexpectedTypeOf"> {
  expectedTypeOf: string;
  value: unknown;
}

export const unexpectedTypeOf = (
  expectedTypeOf: string,
  value: unknown
): UnexpectedTypeOf => ({
  failureType: "UnexpectedTypeOf",
  expectedTypeOf,
  value,
});

export interface NotAllowed extends Failure<"NotAllowed"> {
  allow: unknown[];
  value: unknown;
}

export const notAllowed = (allow: unknown[], value: unknown): NotAllowed => ({
  failureType: "NotAllowed",
  allow,
  value,
});

export interface MultipleFailures<Failures extends Failure<string>>
  extends Failure<"MultipleFailures"> {
  failures: Failures[];
}

export const multipleFailures = <Failures extends Failure<string>>(
  ...failures: Failures[]
): MultipleFailures<Failures> => ({
  failureType: "MultipleFailures",
  failures,
});
