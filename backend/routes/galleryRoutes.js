import { Router } from "express";

import {
  uploadImage,
  getAllImages,
  getCategories,
  getImageById,
  deleteImage,
} from "../controllers/galleryController.js";
import {
  uploadImageValidation,
  galleryIdValidation,
  listGalleryValidation,
} from "../validators/galleryValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { uploadSingleImage } from "../middlewares/uploadMiddleware.js";

const router = Router();

// Public
router.get("/", listGalleryValidation, validate, getAllImages);
router.get("/categories", getCategories);
router.get("/:id", galleryIdValidation, validate, getImageById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  uploadSingleImage("image"),
  uploadImageValidation,
  validate,
  uploadImage
);
router.delete("/:id", protect, adminOnly, galleryIdValidation, validate, deleteImage);

export default router;
