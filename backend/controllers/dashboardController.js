import User from "../models/User.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import Product from "../models/Product.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Get dashboard statistics (admin)
 * @route   GET /api/v1/dashboard/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCustomers,
    totalPackages,
    totalEvents,
    totalProducts,
    totalBookings,
    totalRevenue,
    bookingsByStatus,
    recentBookings,
    recentUsers,
  ] = await Promise.all([
    // Totals
    User.countDocuments(),
    User.countDocuments({ role: "user" }),
    Package.countDocuments(),
    Event.countDocuments(),
    Product.countDocuments(),
    Booking.countDocuments(),

    // Revenue = sum of totalPrice of non-cancelled bookings
    Booking.aggregate([
      { $match: { bookingStatus: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    // Booking status breakdown
    Booking.aggregate([
      { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
    ]),

    // Recent bookings (latest 5)
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("package", "title"),

    // Recent users (latest 5)
    User.find().sort({ createdAt: -1 }).limit(5).select("name email role profileImage"),
  ]);

  const revenue = totalRevenue[0]?.total ?? 0;

  const statusBreakdown = bookingsByStatus.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totals: {
          totalUsers,
          totalCustomers,
          totalPackages,
          totalEvents,
          totalProducts,
          totalBookings,
          totalRevenue: revenue,
        },
        bookingsByStatus: statusBreakdown,
        recentBookings,
        recentUsers,
      },
      "Dashboard statistics fetched successfully"
    )
  );
});

export { getDashboardStats };
