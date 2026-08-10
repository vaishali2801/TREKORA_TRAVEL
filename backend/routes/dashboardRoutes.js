import { Router } from "express";

import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminMiddleware.js";

const router = Router();

// Admin
router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;
