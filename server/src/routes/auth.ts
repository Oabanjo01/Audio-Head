import { Router } from "express";
import {
  createaNewUser,
  generateNewRefreshToken,
  generatePasswordResetLink,
  getUserPublicProfile,
  regenerateVerificationLink,
  resetPassword,
  sendProfile,
  signOut,
  signUserIn,
  updateProfile,
  uploadAnAvatar,
  validGoThrough,
  verifyUser,
} from "src/controllers/authController";
import { isAuthenticated, validatePasswordToken } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import { validate } from "src/middleware/validator";
import {
  updateProfileSchema,
  userSignUpSchema,
  validateResetPassword,
  verifySignUpSchema,
  verifyTokenSchema,
} from "src/schemas/validationSchemas";

const authRouter = Router();

// get requests
authRouter.get("/profile", isAuthenticated, sendProfile);
authRouter.get("/re-verify-user", isAuthenticated, regenerateVerificationLink);
authRouter.get("/sign-out", isAuthenticated, signOut);
authRouter.get("/public-profile/:id", isAuthenticated, getUserPublicProfile);

// post requests
authRouter.post("/sign-up", validate(userSignUpSchema), createaNewUser);
authRouter.post("/verify-token", validate(verifyTokenSchema), verifyUser);
authRouter.post("/sign-in", validate(verifySignUpSchema), signUserIn);
authRouter.post("/refresh-token", generateNewRefreshToken);
authRouter.post(
  "/verify-password-reset-token",
  validate(verifyTokenSchema),
  validatePasswordToken,
  validGoThrough
);
authRouter.post("/generate-reset-password-link", generatePasswordResetLink);
authRouter.post(
  "/reset-password",
  validate(validateResetPassword),
  validatePasswordToken,
  resetPassword
);

// patch requests
authRouter.patch(
  "/update-profile",
  validate(updateProfileSchema),
  isAuthenticated,
  updateProfile
);
authRouter.patch(
  "/update-picture",
  isAuthenticated,
  fileParser,
  uploadAnAvatar
);

export default authRouter;
