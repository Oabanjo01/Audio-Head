import { Router } from "express";
import { createaNewUser, signUserIn, verifyUser } from "src/controller";
import { validateUser } from "src/middleware/validator";
import {
  userSignUpSchema,
  verifySignUpSchema,
  verifyTokenSchema,
} from "src/schemas/validationSchemas";

const authRouter = Router();

authRouter.use("/sign-up", validateUser(userSignUpSchema), createaNewUser);
authRouter.use("/verify", validateUser(verifyTokenSchema), verifyUser);
authRouter.use("/sign-in", validateUser(verifySignUpSchema), signUserIn);

authRouter.use("/refresh-token", (req, res) => {
  res.send("Token Refreshed");
});

export default authRouter;
