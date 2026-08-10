import { body, param, query } from "express-validator";

export const PACKAGE_CATEGORIES = [
  "Monsoon Trek",
  "Snow Trek",
  "One Day Picnic",
  "Adventure Camp",
  "Family Tour",
];

export const DIFFICULTIES = ["Easy", "Moderate", "Hard"];

const SORT_FIELDS = ["price", "rating", "createdAt", "title", "duration"];

// Accepts repeated fields (array) or comma-separated string; normalizes to array
const toArray = (field) =>
  body(field)
    .optional()
    .customSanitizer((value) => {
      if (typeof value === "string") {
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return value;
    })
    .isArray()
    .withMessage(`${field} must be an array or comma-separated values`)
    .custom((value) => value.every((item) => typeof item === "string"))
    .withMessage(`Each ${field} item must be a string`);

const createPackageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("location").trim().notEmpty().withMessage("Location is required"),

  body("duration")
    .toInt()
    .isInt({ min: 1, max: 365 })
    .withMessage("Duration must be between 1 and 365 days"),

  body("price")
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .trim()
    .isIn(PACKAGE_CATEGORIES)
    .withMessage(`Category must be one of: ${PACKAGE_CATEGORIES.join(", ")}`),

  body("difficulty")
    .trim()
    .isIn(DIFFICULTIES)
    .withMessage(`Difficulty must be one of: ${DIFFICULTIES.join(", ")}`),

  body("bestSeason").optional().trim(),
  body("description").optional().trim(),

  toArray("highlights"),
  toArray("included"),
  toArray("excluded"),

  body("isFeatured").optional().toBoolean().isBoolean().withMessage("isFeatured must be a boolean"),
];

const updatePackageValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("location").optional().trim().notEmpty().withMessage("Location is required"),

  body("duration")
    .optional()
    .toInt()
    .isInt({ min: 1, max: 365 })
    .withMessage("Duration must be between 1 and 365 days"),

  body("price")
    .optional()
    .toFloat()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .optional()
    .trim()
    .isIn(PACKAGE_CATEGORIES)
    .withMessage(`Category must be one of: ${PACKAGE_CATEGORIES.join(", ")}`),

  body("difficulty")
    .optional()
    .trim()
    .isIn(DIFFICULTIES)
    .withMessage(`Difficulty must be one of: ${DIFFICULTIES.join(", ")}`),

  body("bestSeason").optional().trim(),
  body("description").optional().trim(),

  toArray("highlights"),
  toArray("included"),
  toArray("excluded"),

  body("isFeatured").optional().toBoolean().isBoolean().withMessage("isFeatured must be a boolean"),
];

const packageIdValidation = [
  param("id").isMongoId().withMessage("Invalid package id"),
];

const listPackagesValidation = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().toInt().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("sort").optional().isIn(SORT_FIELDS).withMessage(`Sort must be one of: ${SORT_FIELDS.join(", ")}`),
  query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'"),
  query("category").optional().trim().isIn(PACKAGE_CATEGORIES).withMessage("Invalid category"),
  query("difficulty").optional().trim().isIn(DIFFICULTIES).withMessage("Invalid difficulty"),
];

export { createPackageValidation, updatePackageValidation, packageIdValidation, listPackagesValidation };
