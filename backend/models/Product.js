import mongoose from "mongoose";

const PRODUCT_CATEGORIES = ["Trekking Gear", "Camping", "Clothing", "Accessories", "Equipment"];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: `Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`,
      },
    },
    buyPrice: {
      type: Number,
      required: [true, "Buy price is required"],
      min: [0, "Buy price cannot be negative"],
    },
    rentPrice: {
      type: Number,
      required: [true, "Rent price is required"],
      min: [0, "Rent price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
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

const Product = mongoose.model("Product", productSchema);

export default Product;
export { PRODUCT_CATEGORIES };
