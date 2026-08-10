import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    error = new ApiError(statusCode, error.message || "Internal server error");
  }

  // Mongoose: invalid ObjectId (CastError)
  if (err instanceof mongoose.Error.CastError) {
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = new ApiError(409, `Duplicate value for ${field}. ${field} already exists.`);
  }

  // Mongoose: validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new ApiError(400, "Validation failed", messages);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please login again.");
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired. Please login again.");
  }

  // Multer errors
  if (err.name === "MulterError") {
    error = new ApiError(400, `Upload error: ${err.message}`);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors.length > 0 && { errors: error.errors }),
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

export { notFound, errorHandler };
