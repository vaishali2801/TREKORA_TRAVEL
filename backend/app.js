import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import hpp from "hpp";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

dotenv.config({ path: "./.env" });

const app = express();

// ===== Security Middlewares =====
app.use(helmet()); // sets secure HTTP headers (X-Frame-Options, CSP, HSTS, etc.)

const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(hpp()); // protects against HTTP Parameter Pollution (?price=1&price=2)

// Global rate limit: 500 requests / 15 min per IP
app.use("/api/v1", apiLimiter);

// Ensure req.body always exists (undefined when no JSON content-type is sent)
app.use((req, res, next) => {
  req.body = req.body || {};
  next();
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ===== Root route =====
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tour Package Management (Trekora) API is running",
    data: {
      baseUrl: "/api/v1",
      health: "/api/v1/health",
      docs: "/postman_collection.json",
    },
  });
});

// ===== Health check (API version prefix for all future routes) =====
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tour Package Management API is running",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// ===== Route mounting =====
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/packages", packageRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ===== 404 + centralized error handling =====
app.use(notFound);
app.use(errorHandler);

export default app;
