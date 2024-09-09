import { RequestHandler } from "express";
import {
  Resetpassword,
  SignIn,
  UpdateProfile,
  User,
  Verify,
} from "src/schemas/validationSchemas";
import { sendResponse } from "src/utilities/sendRequest";
import { Schema, ValidationError } from "yup";

// < {}, {}, CreateUserRequestBody> This is for defining the RequestHandler type so its easy to predefine the req and res body
export const validateUser = (
  schema: Schema<User | Verify | SignIn | Resetpassword | UpdateProfile>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await schema.validate(
        { ...req.body },
        { abortEarly: true, strict: true }
      );
      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        sendResponse(res, 422, error.message);
      } else {
        next(error);
      }
    }
  };
};
