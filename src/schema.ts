import { NumberSchema } from "./number-schema";

export interface Schema {
  version: "v1";
  definition: SchemaDefinition;
}

export type SchemaDefinition = NumberSchema;
