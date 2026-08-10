import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 day"],
      max: [365, "Duration cannot exceed 365 days"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Monsoon Trek", "Snow Trek", "One Day Picnic", "Adventure Camp", "Family Tour"],
        message: "Invalid category",
      },
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: {
        values: ["Easy", "Moderate", "Hard"],
        message: "Invalid difficulty level",
      },
    },
    bestSeason: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    highlights: {
      type: [String],
      default: [],
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const Package = mongoose.model("Package", packageSchema);

export default Package;
