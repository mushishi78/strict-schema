import { Validation, multipleFailures, MultipleFailures, notAllowed, Valid, valid } from './validation'

export function allowIncludes(allow: unknown[], value: unknown) {
  return allow.includes(value) ? valid : notAllowed(allow, value)
}

export const collectFailures = <Validations extends Array<Validation<string>>>(
  ...validations: Validations
): Validations[number] | Valid | MultipleFailures<Exclude<Validations[number], Valid>> => {
  const failures = validations.filter((v) => v.validationType !== 'Valid')

  if (failures.length === 0) return valid
  if (failures.length === 1) return failures[0]

  return multipleFailures(...failures)
}
