import Gallery from "../models/Gallery.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "../services/cloudinaryService.js";

/**
 * @desc    Upload a gallery image (admin)
 * @route   POST /api/v1/gallery
 * @access  Private/Admin
 */
const uploadImage = asyncHandler(async (req, res) => {
  const { title, category } = req.body;

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const result = await uploadToCloudinary(req.file.buffer, "tour/gallery");

  const image = await Gallery.create({
    title,
    category,
    image: result.secure_url,
    uploadedBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { image }, "Image uploaded successfully"));
});

/**
 * @desc    Get all gallery images with pagination, search & category filter
 * @route   GET /api/v1/gallery
 * @access  Public
 */
const getAllImages = asyncHandler(async (req, res) => {
  const { page, limit, category, search } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: search, $options: "i" };

  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Gallery.countDocuments(filter);
  const images = await Gallery.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate("uploadedBy", "name");

  const meta = paginate(currentPage, perPage, total);

  res.status(200).json(new ApiResponse(200, { images, meta }, "Gallery images fetched successfully"));
});

/**
 * @desc    Get all gallery categories
 * @route   GET /api/v1/gallery/categories
 * @access  Public
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Gallery.distinct("category");

  res.status(200).json(new ApiResponse(200, { categories }, "Gallery categories fetched successfully"));
});

/**
 * @desc    Get single gallery image by id
 * @route   GET /api/v1/gallery/:id
 * @access  Public
 */
const getImageById = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id).populate("uploadedBy", "name");
  if (!image) {
    throw new ApiError(404, "Gallery image not found");
  }

  res.status(200).json(new ApiResponse(200, { image }, "Gallery image fetched successfully"));
});

/**
 * @desc    Delete a gallery image (admin)
 * @route   DELETE /api/v1/gallery/:id
 * @access  Private/Admin
 */
const deleteImage = asyncHandler(async (req, res) => {
  const image = await Gallery.findById(req.params.id);
  if (!image) {
    throw new ApiError(404, "Gallery image not found");
  }

  await deleteFromCloudinary(extractPublicId(image.image));
  await image.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Gallery image deleted successfully"));
});

export { uploadImage, getAllImages, getCategories, getImageById, deleteImage };
