import { parseISO } from "date-fns";
import { isValidObjectId } from "mongoose";
import { ProductDocument } from "src/models/productModel";
import categories from "src/utilities/categories";
import * as yup from "yup";

declare module "yup" {
  interface StringSchema {
    validateEmail(message: string): this;
  }
}

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// custom validation for emails
yup.addMethod(yup.string, "validateEmail", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const idAndToken = {
  owner: yup
    .string()
    .test({
      name: "valid-identity",
      message: "This id is invalid",
      test: (value) => {
        return isValidObjectId(value);
      },
    })
    .required("This id is missing"),
  token: yup.string().required("Token is required to proceed"),
};

export const userSignUpSchema = yup.object({
  name: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      regexPassword,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  email: yup
    .string()
    .email("A valid email is required")
    .required("An email address is required"),
});

export const verifyTokenSchema = yup.object({
  ...idAndToken,
});

export const verifySignUpSchema = yup.object({
  password: yup.string().required("Password is required"),
  email: yup
    .string()
    .validateEmail("This is an invalid email")
    .email("A valid email is required")
    .required("An email address is required"),
});

export const validateResetPassword = yup.object({
  ...idAndToken,
  newPassword: yup
    .string()
    .required("Password is required")
    .matches(
      regexPassword,
      "Must Contain atleast 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

export const updateProfileSchema = yup.object({
  name: yup.string().required("Username is required"),
});

export const createProductSchema = new yup.ObjectSchema<
  Pick<
    ProductDocument,
    "name" | "description" | "price" | "purchasingDate" | "category"
  >
>({
  name: yup.string().required("Username is required"),
  description: yup.string().required("Description is required"),
  // Wahala with turning to string
  // price: yup
  //   .number()
  //   .required("Price is required")
  //   .positive("Price must be a positive number"),
  purchasingDate: yup
    .string()
    .transform((value) => {
      // can't parse it? enters error block
      try {
        const modifiedDate = parseISO(value);
        return modifiedDate;
      } catch (error) {
        return "";
      }
    })
    .required("Purchasing date is required"),
  category: yup.string().oneOf(categories).required("Category is required"),
  // This works too, but i wanted to learn the transform method
  price: yup
    .string()
    .transform((value) => {
      if (isNaN(+value)) return "";
      return +value;
    })
    .required("Price is required"),
});

export const updateProductSchema = yup.object({
  name: yup.string().required("Username is required"),
});

// I just added this incase I want to infer the type from the schema later on
export type User = yup.InferType<typeof userSignUpSchema>;
export type Verify = yup.InferType<typeof verifyTokenSchema>;
export type SignIn = yup.InferType<typeof verifySignUpSchema>;
export type Resetpassword = yup.InferType<typeof validateResetPassword>;
export type UpdateProfile = yup.InferType<typeof updateProfileSchema>;
export type CreateProduct = yup.InferType<typeof createProductSchema>;
export type UpdateProduct = yup.InferType<typeof updateProductSchema>;
