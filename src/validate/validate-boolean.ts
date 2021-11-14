import { BooleanSchema } from "../schema/boolean-schema";
import { allowIncludes } from "./validate-helpers";
import { unexpectedTypeOf } from "./failure";

export function validateBoolean(schema: BooleanSchema, value: unknown) {
  const { allow } = schema.properties;
  if (value == null) return allowIncludes(allow, value);
  if (typeof value !== "boolean") return unexpectedTypeOf("boolean", value);
  return allowIncludes(allow, value);
}
