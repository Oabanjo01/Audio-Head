import { isValidObjectId } from "mongoose";
import { InferType, object, string } from "yup";

export const userSignUpSchema = object({
  name: string().required("Username is required"),
  password: string().required("Password is required"),
  email: string()
    .email("A valid email is required")
    .required("An email address is required"),
});

export const verifyTokenSchema = object({
  owner: string().test({
    name: "valid-identity",
    message: "This id is invalid",
    test: (value) => {
      return isValidObjectId(value);
    },
  }),
  token: string().required("Token is required to proceed"),
});

export const verifySignUpSchema = object({
  password: string().required("Password is required"),
  email: string()
    .email("A valid email is required")
    .required("An email address is required"),
});

// I just added this incase I want to infer the type from the schema
export type User = InferType<typeof userSignUpSchema>;
export type Verify = InferType<typeof verifyTokenSchema>;
export type SignIn = InferType<typeof verifySignUpSchema>;
