import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Load env BEFORE cloudinary.config() — ESM imports are hoisted,
// so dotenv.config() in app.js runs too late for this module.
dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
