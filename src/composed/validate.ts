import { ContantTypes, ConstantClaim } from './claims'

export const valid = Symbol('valid')
export type Valid = typeof valid

export type NotConstant<Constant extends ContantTypes> = { type: 'NotConstant'; constant: Constant; value: unknown }
export const notConstant = <Constant extends ContantTypes>(
  constant: Constant,
  value: unknown
): NotConstant<Constant> => ({ type: 'NotConstant', constant, value })

export function validateConstant<Constant extends ContantTypes>({ constant }: ConstantClaim<Constant>, value: unknown) {
  if (value === constant) return valid
  if (Number.isNaN(constant) && Number.isNaN(value)) return valid
  return notConstant(constant, value)
}
