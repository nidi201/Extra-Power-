const express = require("express");
const router = express.Router();

// Simple admin login - no password required (as per spec)
// In production, replace with real auth (JWT + bcrypt)
router.post("/login", (req, res) => {
  const { email } = req.body;

  // Accept any email ending with @cleanpro.com or the hardcoded admin email
  const isAdmin =
    email && (email.endsWith("@cleanpro.com") || email === "admin@cleaning.com");

  if (!isAdmin) {
    return res.status(401).json({ error: "Access denied. Use an admin email." });
  }

  // Return a mock token (no real verification)
  res.json({
    token: "admin-mock-token-" + Date.now(),
    user: { email, role: "admin", name: "Admin" },
  });
});

// Verify token (simple check)
router.get("/verify", (req, res) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer admin-mock-token-")) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
