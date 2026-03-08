const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Get cloud name from environment
let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";

// Handle different formats of CLOUDINARY_CLOUD_NAME
// Format: cloudinary://api_key:api_secret@cloud_name
if (cloudName.includes("://")) {
  const parts = cloudName.split("@");
  if (parts.length > 1) {
    cloudName = parts[parts.length - 1]; // Get everything after the last @
  }
}

console.log("Cloud name extracted:", cloudName);

// Check if we have valid credentials
const hasValidCredentials = cloudName && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (hasValidCredentials) {
  console.log("Configuring Cloudinary...");
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.log("⚠️ Cloudinary credentials not found - using local storage fallback");
}

// Configure storage based on credentials
let storage;
if (hasValidCredentials) {
  // Use Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary,
    params: { 
      folder: "cleanpro", 
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  // Use local disk storage as fallback
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// Configure multer with storage
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;

