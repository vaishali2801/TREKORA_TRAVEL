import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

/**
 * @desc    Update logged-in user's profile (name, email, phone, profile image)
 * @route   PATCH /api/v1/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  // If email is being changed, ensure it is not already taken
  if (email && email !== req.user.email) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, "Email already registered");
    }
  }

  const updates = {};
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (phone) updates.phone = phone;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "tour/users");
    updates.profileImage = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

export { updateProfile };
