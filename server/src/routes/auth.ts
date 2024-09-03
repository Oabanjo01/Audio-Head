import { Router } from "express";
import {
  createaNewUser,
  generateNewRefreshToken,
  regenerateVerificationLink,
  sendProfile,
  signUserIn,
  verifyUser,
} from "src/controller";
import { isAuthenticated } from "src/middleware/auth";
import { validateUser } from "src/middleware/validator";
import {
  userSignUpSchema,
  verifySignUpSchema,
  verifyTokenSchema,
} from "src/schemas/validationSchemas";

const authRouter = Router();

authRouter.use("/sign-up", validateUser(userSignUpSchema), createaNewUser);
authRouter.use("/verify-token", validateUser(verifyTokenSchema), verifyUser);
authRouter.use("/sign-in", validateUser(verifySignUpSchema), signUserIn);
authRouter.use("/profile", isAuthenticated, sendProfile);
authRouter.use("/re-verify-user", isAuthenticated, regenerateVerificationLink);
authRouter.use("/refresh-token", generateNewRefreshToken);

export default authRouter;
