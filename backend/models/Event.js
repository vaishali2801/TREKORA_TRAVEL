import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: ["Upcoming", "Special"],
        message: "Event type must be 'Upcoming' or 'Special'",
      },
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    banner: {
      type: String,
      default: "",
    },
    availableSeats: {
      type: Number,
      required: [true, "Available seats is required"],
      min: [0, "Available seats cannot be negative"],
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

const Event = mongoose.model("Event", eventSchema);

export default Event;
