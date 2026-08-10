import { Router } from "express";

import { updateProfile } from "../controllers/userController.js";
import { updateProfileValidation } from "../validators/authValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadSingleImage } from "../middlewares/uploadMiddleware.js";

const router = Router();

// Private
router.patch(
  "/profile",
  protect,
  uploadSingleImage("profileImage"),
  updateProfileValidation,
  validate,
  updateProfile
);

export default router;
