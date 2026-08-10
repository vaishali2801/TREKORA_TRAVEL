import { body, param, query } from "express-validator";
import { GALLERY_CATEGORIES } from "../models/Gallery.js";

const uploadImageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("category")
    .trim()
    .isIn(GALLERY_CATEGORIES)
    .withMessage(`Category must be one of: ${GALLERY_CATEGORIES.join(", ")}`),
];

const galleryIdValidation = [param("id").isMongoId().withMessage("Invalid gallery id")];

const listGalleryValidation = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().toInt().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("category").optional().trim().isIn(GALLERY_CATEGORIES).withMessage("Invalid category"),
  query("search").optional().trim(),
];

export { uploadImageValidation, galleryIdValidation, listGalleryValidation };
