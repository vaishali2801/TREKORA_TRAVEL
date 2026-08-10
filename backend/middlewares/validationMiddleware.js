import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

/**
 * Runs after express-validator rules and returns 400
 * with all failed validation messages if any.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new ApiError(400, "Validation failed", messages));
  }

  next();
};

export default validate;
