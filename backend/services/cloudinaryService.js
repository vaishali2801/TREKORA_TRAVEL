import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

/**
 * Uploads a file buffer to Cloudinary and returns the upload result.
 */
const uploadToCloudinary = (buffer, folder) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return Promise.reject(
      new ApiError(
        500,
        "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env"
      )
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, `Image upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );
    stream.end(buffer);
  });
};

/**
 * Extracts the Cloudinary public_id from an image URL.
 * e.g. https://res.cloudinary.com/x/image/upload/v1234/tour/packages/abc.png
 *   -> tour/packages/abc
 */
const extractPublicId = (url) => {
  try {
    const parts = new URL(url).pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;
    const withoutVersion = parts.slice(uploadIdx + 1).filter((p) => !/^v\d+$/.test(p));
    const joined = withoutVersion.join("/").replace(/\.[a-z]+$/i, "");
    return joined || null;
  } catch {
    return null;
  }
};

/**
 * Deletes an asset from Cloudinary by public id (silently ignores missing).
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Cloudinary delete failed: ${error.message}`);
  }
};

export { uploadToCloudinary, deleteFromCloudinary, extractPublicId };
