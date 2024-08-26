import { Router } from "express";
import { createaNewUser } from "src/controller";

const authRouter = Router();

authRouter.use("/sign-up", createaNewUser);

authRouter.use("/sign-in", (req, res) => {
  res.send("Signed Up");
});

authRouter.use("/refresh-token", (req, res) => {
  res.send("Token Refreshed");
});

export default authRouter;
