import { body, param, query } from "express-validator";
import { PRODUCT_CATEGORIES } from "../models/Product.js";

const SORT_FIELDS = ["buyPrice", "rentPrice", "stock", "name", "createdAt"];

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("category")
    .trim()
    .isIn(PRODUCT_CATEGORIES)
    .withMessage(`Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`),

  body("buyPrice").toFloat().isFloat({ min: 0 }).withMessage("Buy price must be a positive number"),

  body("rentPrice").toFloat().isFloat({ min: 0 }).withMessage("Rent price must be a positive number"),

  body("stock").toInt().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("description").optional().trim(),
];

const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Name must be between 3 and 100 characters"),

  body("category")
    .optional()
    .trim()
    .isIn(PRODUCT_CATEGORIES)
    .withMessage(`Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`),

  body("buyPrice")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Buy price must be a positive number"),

  body("rentPrice")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Rent price must be a positive number"),

  body("stock").optional().toInt().isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("description").optional().trim(),
];

const productIdValidation = [param("id").isMongoId().withMessage("Invalid product id")];

const listProductsValidation = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().toInt().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("search").optional().trim(),
  query("category").optional().trim().isIn(PRODUCT_CATEGORIES).withMessage("Invalid category"),
  query("sort").optional().isIn(SORT_FIELDS).withMessage(`Sort must be one of: ${SORT_FIELDS.join(", ")}`),
  query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
];

export { createProductValidation, updateProductValidation, productIdValidation, listProductsValidation };
