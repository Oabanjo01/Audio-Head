import { Router } from "express";
import { isAuthenticated } from "src/middleware/auth";

const productRouter = Router();

productRouter.post("/list", isAuthenticated);

export default productRouter;
