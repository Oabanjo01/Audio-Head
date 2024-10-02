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

export const signUpSchema = yup.object({
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
