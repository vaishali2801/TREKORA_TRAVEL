import { Router } from "express";

import {
  register,
  login,
  logout,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from "../validators/authValidation.js";
import validate from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// Public (rate-limited against brute-force)
router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, loginValidation, validate, login);
router.post("/logout", logout);
router.post("/forgot-password", authLimiter, forgotPasswordValidation, validate, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidation, validate, resetPassword);

// Private
router.get("/me", protect, getCurrentUser);
router.patch("/change-password", protect, authLimiter, changePasswordValidation, validate, changePassword);

export default router;
