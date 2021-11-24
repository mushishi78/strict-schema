type Min = number
type Max = number

export type StringRange = [Min, Max]

export const anyStringRange: StringRange = [0, Infinity]
export const nonEmptyStringRange: StringRange = [1, Infinity]
