export type Validation<ValidationType extends string> = {
  validationType: ValidationType;
};

export interface Valid extends Validation<"Valid"> {}
export const valid: Valid = { validationType: "Valid" };

export interface UnexpectedTypeOf extends Validation<"UnexpectedTypeOf"> {
  expectedTypeOf: string;
  value: unknown;
}

export const unexpectedTypeOf = (
  expectedTypeOf: string,
  value: unknown
): UnexpectedTypeOf => ({
  validationType: "UnexpectedTypeOf",
  expectedTypeOf,
  value,
});

export interface NotAllowed extends Validation<"NotAllowed"> {
  allow: unknown[];
  value: unknown;
}

export const notAllowed = (allow: unknown[], value: unknown): NotAllowed => ({
  validationType: "NotAllowed",
  allow,
  value,
});

export interface MultipleFailures<Failures extends Validation<string>>
  extends Validation<"MultipleFailures"> {
  failures: Failures[];
}

export const multipleFailures = <Failures extends Validation<string>>(
  ...failures: Failures[]
): MultipleFailures<Failures> => ({
  validationType: "MultipleFailures",
  failures,
});
