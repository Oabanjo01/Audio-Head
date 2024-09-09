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
} from "src/controller";
import { isAuthenticated, validatePasswordToken } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import { validateUser } from "src/middleware/validator";
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
authRouter.post("/sign-up", validateUser(userSignUpSchema), createaNewUser);
authRouter.post("/verify-token", validateUser(verifyTokenSchema), verifyUser);
authRouter.post("/sign-in", validateUser(verifySignUpSchema), signUserIn);
authRouter.post("/refresh-token", generateNewRefreshToken);
authRouter.post(
  "/verify-password-reset-token",
  validateUser(verifyTokenSchema),
  validatePasswordToken,
  validGoThrough
);
authRouter.post("/generate-reset-password-link", generatePasswordResetLink);
authRouter.post(
  "/reset-password",
  validateUser(validateResetPassword),
  validatePasswordToken,
  resetPassword
);

// patch requests
authRouter.patch(
  "/update-profile",
  validateUser(updateProfileSchema),
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
