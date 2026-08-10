import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  listProductsValidation,
} from "../validators/productValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { uploadSingleImage } from "../middlewares/uploadMiddleware.js";

const router = Router();

// Public
router.get("/", listProductsValidation, validate, getAllProducts);
router.get("/:id", productIdValidation, validate, getProductById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  uploadSingleImage("image"),
  createProductValidation,
  validate,
  createProduct
);
router.put(
  "/:id",
  protect,
  adminOnly,
  productIdValidation,
  validate,
  uploadSingleImage("image"),
  updateProductValidation,
  validate,
  updateProduct
);
router.delete("/:id", protect, adminOnly, productIdValidation, validate, deleteProduct);

export default router;
