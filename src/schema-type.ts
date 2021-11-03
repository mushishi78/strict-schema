export type SchemaType<Type extends string, Properties extends {}> = {
  schemaType: Type;
  properties: Properties;
};
