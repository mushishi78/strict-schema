import { SchemaType } from "./schema-type";

export interface BooleanSchema
  extends SchemaType<"Boolean", BooleanProperties> {}

export interface BooleanProperties {
  allow: Array<true | false | undefined | null>;
}

export const defaultBooleanProperties: BooleanProperties = {
  allow: [true, false],
};

export function booleanSchema(properties?: BooleanProperties): BooleanSchema {
  return {
    schemaType: "Boolean",
    properties: { ...defaultBooleanProperties, ...properties },
  };
}

export const boolean = booleanSchema();
export const onlyTrue = booleanSchema({ allow: [true] });
export const onlyFalse = booleanSchema({ allow: [false] });
