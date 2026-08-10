import { Router } from "express";

import {
  bookPackage,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import {
  bookPackageValidation,
  bookingIdValidation,
  updateBookingStatusValidation,
  listBookingsValidation,
} from "../validators/bookingValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

const router = Router();

// User (private)
router.post("/", protect, bookPackageValidation, validate, bookPackage);
router.get("/my", protect, listBookingsValidation, validate, getMyBookings);
router.patch("/:id/cancel", protect, bookingIdValidation, validate, cancelBooking);

// Admin (private)
router.get("/", protect, adminOnly, listBookingsValidation, validate, getAllBookings);
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  bookingIdValidation,
  validate,
  updateBookingStatusValidation,
  validate,
  updateBookingStatus
);

export default router;
