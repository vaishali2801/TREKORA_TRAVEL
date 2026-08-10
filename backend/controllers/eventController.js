import Event from "../models/Event.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicId } from "../services/cloudinaryService.js";

/**
 * @desc    Create a new event (admin)
 * @route   POST /api/v1/events
 * @access  Private/Admin
 */
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, eventType, date, location, price, availableSeats } = req.body;

  let banner = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "tour/events");
    banner = result.secure_url;
  }

  const event = await Event.create({
    title,
    description: description || "",
    eventType,
    date,
    location,
    price,
    banner,
    availableSeats,
  });

  res.status(201).json(new ApiResponse(201, { event }, "Event created successfully"));
});

/**
 * @desc    Get all events with pagination, search & filter
 * @route   GET /api/v1/events
 * @access  Public
 */
const getAllEvents = asyncHandler(async (req, res) => {
  const { page, limit, search, eventType } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [{ title: { $regex: search, $options: "i" } }, { location: { $regex: search, $options: "i" } }];
  }
  if (eventType) filter.eventType = eventType;

  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Event.countDocuments(filter);
  const events = await Event.find(filter)
    .sort({ date: 1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  const meta = paginate(currentPage, perPage, total);

  res.status(200).json(new ApiResponse(200, { events, meta }, "Events fetched successfully"));
});

/**
 * @desc    Get upcoming events (Upcoming type, date not passed)
 * @route   GET /api/v1/events/upcoming
 * @access  Public
 */
const getUpcomingEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    eventType: "Upcoming",
    date: { $gte: new Date() },
  })
    .sort({ date: 1 })
    .limit(20);

  res.status(200).json(new ApiResponse(200, { events }, "Upcoming events fetched successfully"));
});

/**
 * @desc    Get special events
 * @route   GET /api/v1/events/special
 * @access  Public
 */
const getSpecialEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ eventType: "Special" }).sort({ createdAt: -1 }).limit(20);

  res.status(200).json(new ApiResponse(200, { events }, "Special events fetched successfully"));
});

/**
 * @desc    Get single event by id
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  res.status(200).json(new ApiResponse(200, { event }, "Event fetched successfully"));
});

/**
 * @desc    Update an event (admin)
 * @route   PUT /api/v1/events/:id
 * @access  Private/Admin
 */
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const { title, description, eventType, date, location, price, availableSeats } = req.body;

  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (eventType !== undefined) event.eventType = eventType;
  if (date !== undefined) event.date = date;
  if (location !== undefined) event.location = location;
  if (price !== undefined) event.price = price;
  if (availableSeats !== undefined) event.availableSeats = availableSeats;

  // New banner replaces the old one
  if (req.file) {
    await deleteFromCloudinary(extractPublicId(event.banner));
    const result = await uploadToCloudinary(req.file.buffer, "tour/events");
    event.banner = result.secure_url;
  }

  await event.save();

  res.status(200).json(new ApiResponse(200, { event }, "Event updated successfully"));
});

/**
 * @desc    Delete an event (admin)
 * @route   DELETE /api/v1/events/:id
 * @access  Private/Admin
 */
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  await deleteFromCloudinary(extractPublicId(event.banner));
  await event.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Event deleted successfully"));
});

export { createEvent, getAllEvents, getUpcomingEvents, getSpecialEvents, getEventById, updateEvent, deleteEvent };
