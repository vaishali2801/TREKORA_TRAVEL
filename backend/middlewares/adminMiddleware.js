import ApiError from "../utils/ApiError.js";

/**
 * Role-based authorization. Must be used after `protect`.
 * Allows access only to users with role = "admin".
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return next(new ApiError(403, "Access denied. Admin only."));
};

export default adminOnly;
