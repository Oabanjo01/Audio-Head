import { Router } from "express";
import {
  createaNewUser,
  generateNewRefreshToken,
  generatePasswordResetLink,
  regenerateVerificationLink,
  sendProfile,
  signOut,
  signUserIn,
  validGoThrough,
  verifyUser,
} from "src/controller";
import { isAuthenticated, validatePasswordToken } from "src/middleware/auth";
import { validateUser } from "src/middleware/validator";
import {
  userSignUpSchema,
  verifySignUpSchema,
  verifyTokenSchema,
} from "src/schemas/validationSchemas";

const authRouter = Router();

authRouter.post("/sign-up", validateUser(userSignUpSchema), createaNewUser);
authRouter.post("/verify-token", validateUser(verifyTokenSchema), verifyUser);
authRouter.post("/sign-in", validateUser(verifySignUpSchema), signUserIn);
authRouter.post("/refresh-token", generateNewRefreshToken);
authRouter.post("/reset-password", generatePasswordResetLink);
authRouter.post(
  "/verify-password-reset-token",
  validateUser(verifyTokenSchema),
  validatePasswordToken,
  validGoThrough
);
authRouter.get("/profile", isAuthenticated, sendProfile);
authRouter.get("/re-verify-user", isAuthenticated, regenerateVerificationLink);
authRouter.get("/sign-out", isAuthenticated, signOut);

export default authRouter;
