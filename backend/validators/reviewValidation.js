import { body, param, query } from "express-validator";

const addReviewValidation = [
  body("package").isMongoId().withMessage("Package must be a valid id"),

  body("rating").toInt().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters"),
];

const updateReviewValidation = [
  body("rating").optional().toInt().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters"),
];

const reviewIdValidation = [param("id").isMongoId().withMessage("Invalid review id")];

const packageIdParamValidation = [
  param("packageId").isMongoId().withMessage("Invalid package id"),
];

const listReviewsValidation = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().toInt().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
];

export { addReviewValidation, updateReviewValidation, reviewIdValidation, packageIdParamValidation, listReviewsValidation };
