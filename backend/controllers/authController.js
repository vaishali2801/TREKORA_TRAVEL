import crypto from "crypto";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../services/emailService.js";
import { getWelcomeEmailTemplate, getForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "Email already registered");
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(res, user._id);

  // Send welcome email (non-blocking — API responds even if email fails)
  sendEmail({
    to: user.email,
    subject: "Welcome to Tour Package Management 🎉",
    html: getWelcomeEmailTemplate(user.name),
  });

  res.status(201).json(new ApiResponse(201, { user, token }, "User registered successfully"));
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(res, user._id);

  res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
});

/**
 * @desc    Logout user (clears token cookie)
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json(new ApiResponse(200, { user }, "Current user fetched successfully"));
});

/**
 * @desc    Change password of logged-in user
 * @route   PATCH /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

/**
 * @desc    Request a password reset link (sent to email)
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpire");

  // Always respond the same way — don't leak whether the email exists
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the hashed token for security
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    sendEmail({
      to: user.email,
      subject: "Reset Your Password — Tour Package Management 🔐",
      html: getForgotPasswordEmailTemplate(user.name, resetLink),
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "If that email is registered, a reset link has been sent to it."));
});

/**
 * @desc    Reset password using the emailed token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token || "").digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token. Please request a new one.");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password reset successfully. Please login."));
});

export { register, login, logout, getCurrentUser, changePassword, forgotPassword, resetPassword };
