import { isValidObjectId } from "mongoose";
import { InferType, object, string } from "yup";

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const idAndToken = {
  owner: string()
    .test({
      name: "valid-identity",
      message: "This id is invalid",
      test: (value) => {
        return isValidObjectId(value);
      },
    })
    .required("This id is missing"),
  token: string().required("Token is required to proceed"),
};

export const userSignUpSchema = object({
  name: string().required("Username is required"),
  password: string()
    .required("Password is required")
    .matches(
      regexPassword,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  email: string()
    .email("A valid email is required")
    .required("An email address is required"),
});

export const verifyTokenSchema = object({
  ...idAndToken,
});

export const verifySignUpSchema = object({
  password: string().required("Password is required"),
  email: string()
    .email("A valid email is required")
    .required("An email address is required"),
});

export const validateResetPassword = object({
  ...idAndToken,
  password: string()
    .required("Password is required")
    .matches(
      regexPassword,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

// I just added this incase I want to infer the type from the schema later on
export type User = InferType<typeof userSignUpSchema>;
export type Verify = InferType<typeof verifyTokenSchema>;
export type SignIn = InferType<typeof verifySignUpSchema>;
export type Resetpassword = InferType<typeof validateResetPassword>;
