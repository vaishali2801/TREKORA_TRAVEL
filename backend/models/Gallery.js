import mongoose from "mongoose";

const GALLERY_CATEGORIES = [
  "Trekking",
  "Camping",
  "Adventure",
  "Destinations",
  "Events",
  "Other",
];

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: GALLERY_CATEGORIES,
        message: `Category must be one of: ${GALLERY_CATEGORIES.join(", ")}`,
      },
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    uploadedBy: {
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

const Gallery = mongoose.model("Gallery", gallerySchema);

export default Gallery;
export { GALLERY_CATEGORIES };
