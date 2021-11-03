import { NumberRange, positiveRange, negativeRange } from "./number-range";
import { SchemaType } from "./schema-type";

export interface NumberSchema
  extends SchemaType<"NumberSchema", NumberProperties> {}

export interface NumberProperties {
  mustBeInteger: boolean;
  include: Array<number | NumberRange>;
  exclude: Array<number | NumberRange>;
}

export const defaultNumberProperties: NumberProperties = {
  mustBeInteger: false,
  include: [],
  exclude: [NaN, Infinity, -Infinity],
};

export function number(properties?: Partial<NumberProperties>): NumberSchema {
  return {
    schemaType: "NumberSchema",
    properties: { ...defaultNumberProperties, ...properties },
  };
}

export function integer(): NumberSchema {
  return number({ mustBeInteger: true });
}

export function positiveNumber(): NumberSchema {
  return number({ include: [positiveRange] });
}

export function positiveInteger(): NumberSchema {
  return number({ include: [positiveRange], mustBeInteger: true });
}

export function negativeNumber(): NumberSchema {
  return number({ include: [negativeRange] });
}

export function negativeInteger(): NumberSchema {
  return number({ include: [negativeRange], mustBeInteger: true });
}
