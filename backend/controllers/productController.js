import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "../services/cloudinaryService.js";

/**
 * @desc    Create a new product (admin)
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, category, buyPrice, rentPrice, stock, description } = req.body;

  let image = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "tour/products");
    image = result.secure_url;
  }

  const product = await Product.create({
    name,
    category,
    buyPrice,
    rentPrice,
    stock,
    description: description || "",
    image,
  });

  res.status(201).json(new ApiResponse(201, { product }, "Product created successfully"));
});

/**
 * @desc    Get all products with pagination, search, filter & sort
 * @route   GET /api/v1/products
 * @access  Public
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, search, category, sort = "createdAt", order = "desc" } = req.query;

  const filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;

  const sortObj = { [sort]: order === "asc" ? 1 : -1 };
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  const meta = paginate(currentPage, perPage, total);

  res.status(200).json(new ApiResponse(200, { products, meta }, "Products fetched successfully"));
});

/**
 * @desc    Get single product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json(new ApiResponse(200, { product }, "Product fetched successfully"));
});

/**
 * @desc    Update a product (admin)
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const { name, category, buyPrice, rentPrice, stock, description } = req.body;

  if (name !== undefined) product.name = name;
  if (category !== undefined) product.category = category;
  if (buyPrice !== undefined) product.buyPrice = buyPrice;
  if (rentPrice !== undefined) product.rentPrice = rentPrice;
  if (stock !== undefined) product.stock = stock;
  if (description !== undefined) product.description = description;

  // New image replaces the old one
  if (req.file) {
    await deleteFromCloudinary(extractPublicId(product.image));
    const result = await uploadToCloudinary(req.file.buffer, "tour/products");
    product.image = result.secure_url;
  }

  await product.save();

  res.status(200).json(new ApiResponse(200, { product }, "Product updated successfully"));
});

/**
 * @desc    Delete a product (admin)
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await deleteFromCloudinary(extractPublicId(product.image));
  await product.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
