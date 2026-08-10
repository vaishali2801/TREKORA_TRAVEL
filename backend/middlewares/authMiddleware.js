import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Verifies JWT (from cookie or Authorization: Bearer header)
 * and attaches the authenticated user to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized. Please login first.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User no longer exists. Please login again.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const message =
      error.name === "TokenExpiredError"
        ? "Token expired. Please login again."
        : "Invalid token. Please login again.";
    throw new ApiError(401, message);
  }
});

export { protect };
