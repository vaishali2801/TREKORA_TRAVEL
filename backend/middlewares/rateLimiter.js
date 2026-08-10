import rateLimit from "express-rate-limit";

/**
 * Global API limiter — applies to every /api/v1 route.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // max 500 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Strict limiter for sensitive auth endpoints (register/login/change-password)
 * to slow down brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // max 5 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts from this IP. Please try again after 15 minutes.",
  },
});
