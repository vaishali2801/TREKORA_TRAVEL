import { body, param, query } from "express-validator";
import { BOOKING_STATUSES, PAYMENT_STATUSES } from "../services/bookingService.js";

const bookPackageValidation = [
  body("package")
    .isMongoId()
    .withMessage("Package must be a valid id"),

  body("bookingDate")
    .toDate()
    .isISO8601()
    .withMessage("Booking date must be a valid ISO date (YYYY-MM-DD)")
    .custom((value) => !isNaN(value.getTime()))
    .withMessage("Booking date must be a valid date")
    .custom((value) => value >= new Date().setHours(0, 0, 0, 0))
    .withMessage("Booking date cannot be in the past"),

  body("participants")
    .toInt()
    .isInt({ min: 1, max: 50 })
    .withMessage("Participants must be between 1 and 50"),

  body("paymentStatus")
    .optional()
    .trim()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
];

const bookingIdValidation = [param("id").isMongoId().withMessage("Invalid booking id")];

const updateBookingStatusValidation = [
  body("bookingStatus")
    .optional()
    .trim()
    .isIn(BOOKING_STATUSES)
    .withMessage(`Booking status must be one of: ${BOOKING_STATUSES.join(", ")}`),

  body("paymentStatus")
    .optional()
    .trim()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
];

const listBookingsValidation = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().toInt().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("bookingStatus")
    .optional()
    .trim()
    .isIn(BOOKING_STATUSES)
    .withMessage(`Booking status must be one of: ${BOOKING_STATUSES.join(", ")}`),
  query("paymentStatus")
    .optional()
    .trim()
    .isIn(PAYMENT_STATUSES)
    .withMessage(`Payment status must be one of: ${PAYMENT_STATUSES.join(", ")}`),
];

export { bookPackageValidation, bookingIdValidation, updateBookingStatusValidation, listBookingsValidation };
