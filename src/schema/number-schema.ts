import { NumberRange, positiveRange, negativeRange } from "../lib/number-range";
import { SchemaType } from "./schema-type";

export interface NumberSchema
  extends SchemaType<"NumberSchema", NumberProperties> {}

export interface NumberProperties {
  mustBeInteger: boolean;
  allow: Array<number | NumberRange>;
  exclude: Array<number | NumberRange>;
}

export const defaultNumberProperties: NumberProperties = {
  mustBeInteger: false,
  allow: [],
  exclude: [NaN, Infinity, -Infinity],
};

export function numberSchema(
  properties?: Partial<NumberProperties>
): NumberSchema {
  return {
    schemaType: "NumberSchema",
    properties: { ...defaultNumberProperties, ...properties },
  };
}

export const number = numberSchema();
export const integer = numberSchema({ mustBeInteger: true });
export const positiveNumber = numberSchema({ allow: [positiveRange] });
export const negativeNumber = numberSchema({ allow: [negativeRange] });
export const positiveInteger = numberSchema({
  allow: [positiveRange],
  mustBeInteger: true,
});
export const negativeInteger = numberSchema({
  allow: [negativeRange],
  mustBeInteger: true,
});
