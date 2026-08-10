import multer from "multer";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  cb(new ApiError(400, `Unsupported file type: ${file.mimetype}. Only JPG, PNG, WEBP allowed.`));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

const uploadSingleImage = (fieldName) => upload.single(fieldName);

export { upload, uploadSingleImage };
