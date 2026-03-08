const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    badge: { type: String, default: "" }, // e.g. "Best Seller", "Eco-Friendly"
    image: { type: String, default: "" }, // filename stored in /uploads
    status: { type: String, enum: ["active", "draft"], default: "active" },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
