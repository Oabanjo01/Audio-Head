import { categoryNames } from "root/constants/categories";
import { CreateProductModel } from "root/constants/types/productTypes";
import * as yup from "yup";

declare module "yup" {
  interface StringSchema {
    validateEmail(message: string): this;
  }
}

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

yup.addMethod(yup.string, "validateEmail", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

export const signInSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      regexPassword,
      "Must Contain atleast 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  email: yup
    .string()
    .validateEmail("This is an invalid email")
    .email("A valid email is required")
    .required("An email address is required"),
});

export const signUpSchema = yup.object({
  name: yup.string().required("Your full name is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      regexPassword,
      "Must Contain atleast 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  email: yup
    .string()
    .validateEmail("This is an invalid email")
    .email("A valid email is required")
    .required("An email address is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .validateEmail("This is an invalid email")
    .email("A valid email is required")
    .required("An email address is required"),
});

export const createProductSchema = new yup.ObjectSchema<
  Pick<
    CreateProductModel,
    "name" | "description" | "price" | "purchasingDate" | "category"
  >
>({
  name: yup.string().required("Product name is requird"),
  price: yup.number().required("Product price is requird"),
  description: yup.string().required("Product descriptioname is requird"),
  purchasingDate: yup.string().required("Product creation date is requird"),
  category: yup
    .string()
    .oneOf(categoryNames, "Invalid category selectd")
    .required("Product category is requird"),
});

export type SignInSchemaType = yup.InferType<typeof signInSchema>;
export type SignUpSchemaType = yup.InferType<typeof signUpSchema>;
export type ForgotPasswordSchemaType = yup.InferType<
  typeof forgotPasswordSchema
>;
export type CreateProductSchemaType = yup.InferType<typeof createProductSchema>;
