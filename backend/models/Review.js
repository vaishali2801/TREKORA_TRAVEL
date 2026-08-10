import mongoose from "mongoose";
import Package from "./Package.js";

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
      default: "",
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

// One review per user per package
reviewSchema.index({ user: 1, package: 1 }, { unique: true });

/**
 * Recalculates and stores the average rating of a package
 * based on all its reviews.
 */
reviewSchema.statics.calculateAverageRating = async function (packageId) {
  const id = mongoose.isValidObjectId(packageId) ? new mongoose.Types.ObjectId(packageId) : packageId;

  const result = await this.aggregate([
    { $match: { package: id } },
    { $group: { _id: "$package", avgRating: { $avg: "$rating" } } },
  ]);

  const avg = result[0]?.avgRating ?? 0;
  await Package.updateOne({ _id: id }, { rating: Math.round(avg * 10) / 10 });
};

const Review = mongoose.model("Review", reviewSchema);

export default Review;
