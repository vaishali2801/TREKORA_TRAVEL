import ApiError from "../utils/ApiError.js";

export const BOOKING_STATUSES = ["Pending", "Confirmed", "Cancelled", "Completed"];
export const PAYMENT_STATUSES = ["Pending", "Paid", "Refunded"];

/**
 * Calculates the total price of a booking.
 */
const calculateTotalPrice = (packagePrice, participants) => {
  if (!packagePrice || packagePrice < 0) {
    throw new ApiError(400, "Invalid package price");
  }
  if (!participants || participants < 1) {
    throw new ApiError(400, "Participants must be at least 1");
  }
  return packagePrice * participants;
};

/**
 * A booking can be cancelled only in Pending or Confirmed state.
 */
const isCancelable = (status) => ["Pending", "Confirmed"].includes(status);

/**
 * Determines the initial statuses for a new booking.
 */
const initialStatuses = (paymentStatus) => ({
  paymentStatus: ["Paid", "Refunded"].includes(paymentStatus) ? paymentStatus : "Pending",
  bookingStatus: "Pending",
});

export { calculateTotalPrice, isCancelable, initialStatuses };
