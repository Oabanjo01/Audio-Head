import { Router } from "express";
import {
  createNewProduct,
  deleteProduct,
  deleteProductImage,
  updateExistingProduct,
} from "src/controllers/productController";
import { isAuthenticated } from "src/middleware/auth";
import fileParser from "src/middleware/fileParser";
import { validate } from "src/middleware/validator";
import {
  createProductSchema,
  updateProductSchema,
} from "src/schemas/validationSchemas";

const productRouter = Router();

productRouter.post(
  "/create",
  isAuthenticated,
  fileParser,
  validate(createProductSchema),
  createNewProduct
);

productRouter.patch(
  "/:id",
  isAuthenticated,
  fileParser,
  validate(updateProductSchema),
  updateExistingProduct
);

productRouter.delete("/:id", isAuthenticated, deleteProduct);

productRouter.delete(
  "/image/:id/:imageId",
  isAuthenticated,
  deleteProductImage
);

export default productRouter;
