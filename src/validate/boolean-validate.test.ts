import test, { DeepEqualAssertion } from "ava";
import { BooleanFailureType, validateBoolean } from "./boolean-validate";

import {
  boolean,
  booleanSchema,
  BooleanSchema,
  onlyFalse,
  onlyTrue,
} from "../schema/boolean-schema";

function testValidateBoolean(
  deepEqual: DeepEqualAssertion,
  schema: BooleanSchema,
  json: unknown,
  failureTypes: BooleanFailureType[]
) {
  deepEqual(
    validateBoolean(schema, json).map((t) => t.type),
    failureTypes
  );
}

test("boolean-validate boolean", (t) => {
  testValidateBoolean(t.deepEqual, boolean, true, []);
  testValidateBoolean(t.deepEqual, boolean, false, []);
  testValidateBoolean(t.deepEqual, boolean, null, ["unexpected-null"]);
  testValidateBoolean(t.deepEqual, boolean, undefined, [
    "unexpected-undefined",
  ]);
  testValidateBoolean(t.deepEqual, boolean, [true], ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, boolean, {}, ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, boolean, "hello", ["expected-boolean"]);
});

test("boolean-validate onlyTrue", (t) => {
  testValidateBoolean(t.deepEqual, onlyTrue, true, []);
  testValidateBoolean(t.deepEqual, onlyTrue, false, ["not-allowed"]);
  testValidateBoolean(t.deepEqual, onlyTrue, null, ["unexpected-null"]);
  testValidateBoolean(t.deepEqual, onlyTrue, undefined, [
    "unexpected-undefined",
  ]);
  testValidateBoolean(t.deepEqual, onlyTrue, [true], ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, onlyTrue, {}, ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, onlyTrue, "hello", ["expected-boolean"]);
});

test("boolean-validate onlyFalse", (t) => {
  testValidateBoolean(t.deepEqual, onlyFalse, true, ["not-allowed"]);
  testValidateBoolean(t.deepEqual, onlyFalse, false, []);
  testValidateBoolean(t.deepEqual, onlyFalse, null, ["unexpected-null"]);
  testValidateBoolean(t.deepEqual, onlyFalse, undefined, [
    "unexpected-undefined",
  ]);
  testValidateBoolean(t.deepEqual, onlyFalse, [true], ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, onlyFalse, {}, ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, onlyFalse, "hello", ["expected-boolean"]);
});

test("boolean-validate boolean with null", (t) => {
  const schema = booleanSchema({ allow: [true, false, null] });
  testValidateBoolean(t.deepEqual, schema, true, []);
  testValidateBoolean(t.deepEqual, schema, false, []);
  testValidateBoolean(t.deepEqual, schema, null, []);
  testValidateBoolean(t.deepEqual, schema, undefined, ["unexpected-undefined"]);
  testValidateBoolean(t.deepEqual, schema, [true], ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, schema, {}, ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, schema, "hello", ["expected-boolean"]);
});

test("boolean-validate boolean with undefined", (t) => {
  const schema = booleanSchema({
    allow: [true, false, undefined],
  });
  testValidateBoolean(t.deepEqual, schema, true, []);
  testValidateBoolean(t.deepEqual, schema, false, []);
  testValidateBoolean(t.deepEqual, schema, null, ["unexpected-null"]);
  testValidateBoolean(t.deepEqual, schema, undefined, []);
  testValidateBoolean(t.deepEqual, schema, [true], ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, schema, {}, ["expected-boolean"]);
  testValidateBoolean(t.deepEqual, schema, "hello", ["expected-boolean"]);
});
