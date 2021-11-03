export type Failure<FailureType extends string = never> = {
  type: FailureType;
  message: string;
  context: string[];
};

export function noFailures<
  FailureType extends string = never
>(): Failure<FailureType>[] {
  return [];
}

export function oneFailure<FailureType extends string = never>(
  type: FailureType,
  message: string
): Failure<FailureType>[] {
  return [{ type, message, context: [] }];
}

export function addFailure<FailureType extends string = never>(
  failures: Failure<FailureType>[],
  type: FailureType,
  message: string
): Failure<FailureType>[] {
  return [...failures, { type, message, context: [] }];
}

export function addContext<FailureType extends string = never>(
  failures: Failure<FailureType>[],
  context: string
): Failure<FailureType>[] {
  return failures.map((failure) => ({
    ...failure,
    context: failure.context.concat(context),
  }));
}

export function failureToString<FailureType extends string = never>(
  failure: Failure<FailureType>
): string {
  return `Failure:
  ${failure.message}
    ${failure.context.join("\n    ")}
`;
}

export function failuresToString<FailureType extends string = never>(
  failures: Failure<FailureType>[]
): string {
  return failures.map(failureToString).join("\n\n");
}

export function printFailures<FailureType extends string = never>(
  failures: Failure<FailureType>[]
) {
  console.log(failuresToString(failures));
}
