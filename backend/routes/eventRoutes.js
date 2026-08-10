import { Router } from "express";

import {
  createEvent,
  getAllEvents,
  getUpcomingEvents,
  getSpecialEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import {
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  listEventsValidation,
} from "../validators/eventValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { uploadSingleImage } from "../middlewares/uploadMiddleware.js";

const router = Router();

// Public
router.get("/", listEventsValidation, validate, getAllEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/special", getSpecialEvents);
router.get("/:id", eventIdValidation, validate, getEventById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  uploadSingleImage("banner"),
  createEventValidation,
  validate,
  createEvent
);
router.put(
  "/:id",
  protect,
  adminOnly,
  eventIdValidation,
  validate,
  uploadSingleImage("banner"),
  updateEventValidation,
  validate,
  updateEvent
);
router.delete("/:id", protect, adminOnly, eventIdValidation, validate, deleteEvent);

export default router;
