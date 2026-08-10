import { Router } from "express";

import {
  addReview,
  getReviewsByPackage,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import {
  addReviewValidation,
  updateReviewValidation,
  reviewIdValidation,
  packageIdParamValidation,
  listReviewsValidation,
} from "../validators/reviewValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Public
router.get(
  "/package/:packageId",
  packageIdParamValidation,
  validate,
  listReviewsValidation,
  validate,
  getReviewsByPackage
);

// Private
router.post("/", protect, addReviewValidation, validate, addReview);
router.patch("/:id", protect, reviewIdValidation, validate, updateReviewValidation, validate, updateReview);
router.delete("/:id", protect, reviewIdValidation, validate, deleteReview);

export default router;
