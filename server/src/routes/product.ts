import { Router } from "express";
import {
  createNewProduct,
  updateExistingProduct,
} from "src/controllers/productController";
import { isAuthenticated } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import { validate } from "src/middleware/validator";
import { createProductSchema } from "src/schemas/validationSchemas";

const productRouter = Router();

productRouter.post(
  "/create",
  isAuthenticated,
  fileParser,
  validate(createProductSchema),
  createNewProduct
);

productRouter.post(
  "/:id",
  isAuthenticated,
  fileParser,
  validate(createProductSchema),
  updateExistingProduct
);

export default productRouter;
