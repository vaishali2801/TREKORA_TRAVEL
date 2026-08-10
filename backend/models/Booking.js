import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Package is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    participants: {
      type: Number,
      required: [true, "Participants is required"],
      min: [1, "Participants must be at least 1"],
      max: [50, "Participants cannot exceed 50"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Pending", "Paid", "Refunded"],
        message: "Invalid payment status",
      },
      default: "Pending",
    },
    bookingStatus: {
      type: String,
      enum: {
        values: ["Pending", "Confirmed", "Cancelled", "Completed"],
        message: "Invalid booking status",
      },
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
