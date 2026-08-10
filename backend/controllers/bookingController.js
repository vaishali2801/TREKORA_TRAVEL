import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import paginate from "../utils/pagination.js";
import sendEmail from "../services/emailService.js";
import {
  getBookingConfirmationEmailTemplate,
  getBookingCancelledEmailTemplate,
  getBookingCompletedEmailTemplate,
} from "../utils/emailTemplates.js";
import {
  calculateTotalPrice,
  isCancelable,
  initialStatuses,
} from "../services/bookingService.js";

/**
 * @desc    Book a package (logged-in user)
 * @route   POST /api/v1/bookings
 * @access  Private
 */
const bookPackage = asyncHandler(async (req, res) => {
  const { package: packageId, bookingDate, participants, paymentStatus } = req.body;

  const packageDoc = await Package.findById(packageId);
  if (!packageDoc) {
    throw new ApiError(404, "Package not found");
  }

  const totalPrice = calculateTotalPrice(packageDoc.price, participants);
  const statuses = initialStatuses(paymentStatus);

  const booking = await Booking.create({
    user: req.user._id,
    package: packageId,
    bookingDate,
    participants,
    totalPrice,
    ...statuses,
  });

  const populated = await Booking.findById(booking._id).populate(
    "package",
    "title location price duration images"
  );

  // Send booking confirmation email (non-blocking)
  sendEmail({
    to: req.user.email,
    subject: "Booking Confirmed — Tour Package Management ✅",
    html: getBookingConfirmationEmailTemplate(req.user.name, {
      packageTitle: packageDoc.title,
      bookingDate: booking.bookingDate,
      participants,
      totalPrice,
    }),
  });

  res
    .status(201)
    .json(new ApiResponse(201, { booking: populated }, "Package booked successfully"));
});

/**
 * @desc    Get logged-in user's booking history
 * @route   GET /api/v1/bookings/my
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const { page, limit, bookingStatus } = req.query;

  const filter = { user: req.user._id };
  if (bookingStatus) filter.bookingStatus = bookingStatus;

  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Booking.countDocuments(filter);
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate("package", "title location price duration images");

  const meta = paginate(currentPage, perPage, total);

  res
    .status(200)
    .json(new ApiResponse(200, { bookings, meta }, "Booking history fetched successfully"));
});

/**
 * @desc    Cancel own booking
 * @route   PATCH /api/v1/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate(
    "package",
    "title"
  );

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (!isCancelable(booking.bookingStatus)) {
    throw new ApiError(
      400,
      `Booking cannot be cancelled in status: ${booking.bookingStatus}`
    );
  }

  booking.bookingStatus = "Cancelled";
  await booking.save();

  // Send cancellation email (non-blocking)
  sendEmail({
    to: req.user.email,
    subject: "Booking Cancelled — Tour Package Management",
    html: getBookingCancelledEmailTemplate(req.user.name, booking.package?.title || "your package"),
  });

  res.status(200).json(new ApiResponse(200, { booking }, "Booking cancelled successfully"));
});

/**
 * @desc    Admin: get all bookings with pagination & filters
 * @route   GET /api/v1/bookings
 * @access  Private/Admin
 */
const getAllBookings = asyncHandler(async (req, res) => {
  const { page, limit, bookingStatus, paymentStatus } = req.query;

  const filter = {};
  if (bookingStatus) filter.bookingStatus = bookingStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const currentPage = Math.max(parseInt(page) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

  const total = await Booking.countDocuments(filter);
  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .populate("user", "name email phone")
    .populate("package", "title location price images");

  const meta = paginate(currentPage, perPage, total);

  res
    .status(200)
    .json(new ApiResponse(200, { bookings, meta }, "All bookings fetched successfully"));
});

/**
 * @desc    Admin: update booking status / payment status
 * @route   PATCH /api/v1/bookings/:id/status
 * @access  Private/Admin
 */
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus, paymentStatus } = req.body || {};

  const booking = await Booking.findById(req.params.id).populate("user", "name email").populate(
    "package",
    "title"
  );
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (bookingStatus) booking.bookingStatus = bookingStatus;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  // Completing a booking also marks payment as Paid
  if (booking.bookingStatus === "Completed" && booking.paymentStatus === "Pending") {
    booking.paymentStatus = "Paid";
  }

  await booking.save();

  // Notify user when their booking is completed (non-blocking)
  if (bookingStatus === "Completed") {
    sendEmail({
      to: booking.user.email,
      subject: "Trip Completed — Tour Package Management 🎉",
      html: getBookingCompletedEmailTemplate(booking.user.name, booking.package?.title || "your package"),
    });
  }

  res.status(200).json(new ApiResponse(200, { booking }, "Booking updated successfully"));
});

export { bookPackage, getMyBookings, cancelBooking, getAllBookings, updateBookingStatus };
