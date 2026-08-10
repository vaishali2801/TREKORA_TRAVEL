import { Router } from "express";

import {
  createPackage,
  getAllPackages,
  getFeaturedPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import {
  createPackageValidation,
  updatePackageValidation,
  packageIdValidation,
  listPackagesValidation,
} from "../validators/packageValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = Router();

// Public
router.get("/", listPackagesValidation, validate, getAllPackages);
router.get("/featured", getFeaturedPackages);
router.get("/:id", packageIdValidation, validate, getPackageById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 6),
  createPackageValidation,
  validate,
  createPackage
);
router.put(
  "/:id",
  protect,
  adminOnly,
  packageIdValidation,
  validate,
  upload.array("images", 6),
  updatePackageValidation,
  validate,
  updatePackage
);
router.delete("/:id", protect, adminOnly, packageIdValidation, validate, deletePackage);

export default router;
