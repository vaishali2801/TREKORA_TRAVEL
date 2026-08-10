import Review from "../models/Review.js";
import Package from "../models/Package.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";

/**
 * @desc    Add a review for a package (logged-in user)
 * @route   POST /api/v1/reviews
 * @access  Private
 */
const addReview = asyncHandler(async (req, res) => {
  const { package: packageId, rating, comment } = req.body;

  const packageDoc = await Package.findById(packageId);
  if (!packageDoc) {
    throw new ApiError(404, "Package not found");
  }

  const existing = await Review.findOne({ user: req.user._id, package: packageId });
  if (existing) {
    throw new ApiError(409, "You have already reviewed this package");
  }

  const review = await Review.create({
    user: req.user._id,
    package: packageId,
    rating,
    comment: comment || "",
  });

  await Review.calculateAverageRating(packageId);

  const populated = await Review.findById(review._id).populate("user", "name profileImage");

  res.status(201).json(new ApiResponse(201, { review: populated }, "Review added successfully"));
});

/**
 * @desc    Get all reviews for a package
 * @route   GET /api/v1/reviews/package/:packageId
 * @access  Public
 */
const getReviewsByPackage = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const filter = { package: req.params.packageId };
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate("user", "name profileImage");

  const meta = paginate(currentPage, perPage, total);

  res.status(200).json(new ApiResponse(200, { reviews, meta }, "Reviews fetched successfully"));
});

/**
 * @desc    Update own review
 * @route   PATCH /api/v1/reviews/:id
 * @access  Private
 */
const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;

  await review.save();
  await Review.calculateAverageRating(review.package);

  const populated = await Review.findById(review._id).populate("user", "name profileImage");

  res.status(200).json(new ApiResponse(200, { review: populated }, "Review updated successfully"));
});

/**
 * @desc    Delete own review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const packageId = review.package;
  await review.deleteOne();
  await Review.calculateAverageRating(packageId);

  res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});

export { addReview, getReviewsByPackage, updateReview, deleteReview };
