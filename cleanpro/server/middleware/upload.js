const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Get cloud name from environment
let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";

// If cloud_name contains "://", extract the cloud name after @
if (cloudName.includes("://")) {
  const parts = cloudName.split("@");
  cloudName = parts[1] || parts[0];
}

console.log("Cloudinary Cloud Name:", cloudName);

cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { 
    folder: "cleanpro", 
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Configure multer with storage
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Export as default for backward compatibility
module.exports = upload;
module.exports.default = upload;

