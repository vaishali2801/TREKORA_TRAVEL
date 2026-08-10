import Package from "../models/Package.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../services/cloudinaryService.js";

/**
 * @desc    Create a new package (admin)
 * @route   POST /api/v1/packages
 * @access  Private/Admin
 */
const createPackage = asyncHandler(async (req, res) => {
  const {
    title,
    location,
    duration,
    price,
    category,
    difficulty,
    bestSeason,
    description,
    highlights,
    included,
    excluded,
    isFeatured,
  } = req.body;

  const images = [];
  if (req.files?.length) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "tour/packages");
      images.push(result.secure_url);
    }
  }

  const packageDoc = await Package.create({
    title,
    location,
    duration,
    price,
    category,
    difficulty,
    bestSeason: bestSeason || "",
    description: description || "",
    highlights: highlights || [],
    included: included || [],
    excluded: excluded || [],
    images,
    isFeatured: isFeatured || false,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, { package: packageDoc }, "Package created successfully"));
});

/**
 * @desc    Get all packages with pagination, search, sort & filter
 * @route   GET /api/v1/packages
 * @access  Public
 */
const getAllPackages = asyncHandler(async (req, res) => {
  const {
    page,
    limit,
    search,
    sort = "createdAt",
    order = "desc",
    category,
    difficulty,
    isFeatured,
  } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

  const sortObj = { [sort]: order === "asc" ? 1 : -1 };
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Package.countDocuments(filter);
  const packages = await Package.find(filter)
    .sort(sortObj)
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate("createdBy", "name email");

  const meta = paginate(currentPage, perPage, total);

  res
    .status(200)
    .json(new ApiResponse(200, { packages, meta }, "Packages fetched successfully"));
});

/**
 * @desc    Get featured packages
 * @route   GET /api/v1/packages/featured
 * @access  Public
 */
const getFeaturedPackages = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 6, 1), 20);

  const packages = await Package.find({ isFeatured: true })
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit)
    .populate("createdBy", "name email");

  res
    .status(200)
    .json(new ApiResponse(200, { packages }, "Featured packages fetched successfully"));
});

/**
 * @desc    Get single package by id
 * @route   GET /api/v1/packages/:id
 * @access  Public
 */
const getPackageById = asyncHandler(async (req, res) => {
  const packageDoc = await Package.findById(req.params.id).populate("createdBy", "name email");

  if (!packageDoc) {
    throw new ApiError(404, "Package not found");
  }

  res.status(200).json(new ApiResponse(200, { package: packageDoc }, "Package fetched successfully"));
});

/**
 * @desc    Update a package (admin)
 * @route   PUT /api/v1/packages/:id
 * @access  Private/Admin
 */
const updatePackage = asyncHandler(async (req, res) => {
  const packageDoc = await Package.findById(req.params.id);
  if (!packageDoc) {
    throw new ApiError(404, "Package not found");
  }

  const {
    title,
    location,
    duration,
    price,
    category,
    difficulty,
    bestSeason,
    description,
    highlights,
    included,
    excluded,
    isFeatured,
  } = req.body;

  if (title !== undefined) packageDoc.title = title;
  if (location !== undefined) packageDoc.location = location;
  if (duration !== undefined) packageDoc.duration = duration;
  if (price !== undefined) packageDoc.price = price;
  if (category !== undefined) packageDoc.category = category;
  if (difficulty !== undefined) packageDoc.difficulty = difficulty;
  if (bestSeason !== undefined) packageDoc.bestSeason = bestSeason;
  if (description !== undefined) packageDoc.description = description;
  if (highlights !== undefined) packageDoc.highlights = highlights;
  if (included !== undefined) packageDoc.included = included;
  if (excluded !== undefined) packageDoc.excluded = excluded;
  if (isFeatured !== undefined) packageDoc.isFeatured = isFeatured;

  // New images replace existing ones
  if (req.files?.length) {
    for (const url of packageDoc.images) {
      await deleteFromCloudinary(extractPublicId(url));
    }
    const images = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "tour/packages");
      images.push(result.secure_url);
    }
    packageDoc.images = images;
  }

  await packageDoc.save();

  res.status(200).json(new ApiResponse(200, { package: packageDoc }, "Package updated successfully"));
});

/**
 * @desc    Delete a package (admin)
 * @route   DELETE /api/v1/packages/:id
 * @access  Private/Admin
 */
const deletePackage = asyncHandler(async (req, res) => {
  const packageDoc = await Package.findById(req.params.id);
  if (!packageDoc) {
    throw new ApiError(404, "Package not found");
  }

  // Remove images from Cloudinary
  for (const url of packageDoc.images) {
    await deleteFromCloudinary(extractPublicId(url));
  }

  await packageDoc.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Package deleted successfully"));
});

export {
  createPackage,
  getAllPackages,
  getFeaturedPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
