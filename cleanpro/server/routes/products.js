const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const upload = require("../middleware/upload");

// GET all products (with optional category filter & search)
router.get("/", async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const query = {};
    if (category && category !== "All Products") query.category = category;
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description, badge, status, stock } = req.body;
    
    let image = "";
    if (req.file) {
      // Handle both Cloudinary URL and local file path
      if (req.file.path && req.file.path.includes("cloudinary")) {
        // Cloudinary returns the full URL in path
        image = req.file.path;
      } else if (req.file.path) {
        // Local file - return just the filename
        image = req.file.filename;
      }
    }
    
    const product = new Product({ 
      name, 
      price, 
      category, 
      description, 
      badge, 
      status, 
      stock, 
      image 
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(400).json({ error: err.message });
  }
});

// PUT update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (req.file) {
      // Handle both Cloudinary URL and local file path
      if (req.file.path && req.file.path.includes("cloudinary")) {
        updates.image = req.file.path;
      } else if (req.file.path) {
        updates.image = req.file.filename;
      }
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

