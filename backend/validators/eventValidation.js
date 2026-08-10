import { body, param, query } from "express-validator";

const EVENT_TYPES = ["Upcoming", "Special"];

const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description").optional().trim(),

  body("eventType")
    .trim()
    .isIn(EVENT_TYPES)
    .withMessage(`Event type must be one of: ${EVENT_TYPES.join(", ")}`),

  body("date")
    .toDate()
    .isISO8601()
    .withMessage("Date must be a valid ISO date (YYYY-MM-DD)")
    .custom((value) => !isNaN(value.getTime()))
    .withMessage("Date must be a valid date"),

  body("location").trim().notEmpty().withMessage("Location is required"),

  body("price").toFloat().isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("availableSeats")
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Available seats must be a non-negative integer"),
];

const updateEventValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description").optional().trim(),

  body("eventType")
    .optional()
    .trim()
    .isIn(EVENT_TYPES)
    .withMessage(`Event type must be one of: ${EVENT_TYPES.join(", ")}`),

  body("date")
    .optional()
    .toDate()
    .isISO8601()
    .withMessage("Date must be a valid ISO date (YYYY-MM-DD)")
    .custom((value) => !isNaN(value.getTime()))
    .withMessage("Date must be a valid date"),

  body("location").optional().trim().notEmpty().withMessage("Location is required"),

  body("price").optional().toFloat().isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("availableSeats")
    .optional()
    .toInt()
    .isInt({ min: 0 })
    .withMessage("Available seats must be a non-negative integer"),
];

const eventIdValidation = [param("id").isMongoId().withMessage("Invalid event id")];

const listEventsValidation = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().toInt().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("search").optional().trim(),
  query("eventType").optional().trim().isIn(EVENT_TYPES).withMessage("Invalid event type"),
];

export { createEventValidation, updateEventValidation, eventIdValidation, listEventsValidation };
