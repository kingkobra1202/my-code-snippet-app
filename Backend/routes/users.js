const express = require("express");
const router = express.Router();
const { authenticateAdmin } = require("../middleware/auth");
const User = require("../models/User");

// Get all users (admin-only)
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    console.log("Admin fetched users");
    const users = await User.find().select("username email createdAt").lean();
    if (users.length === 0) {
      console.log("No users found");
      return res.status(204).json([]);
    }
    console.log("Users fetched:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get all users
router.get("/admin/users", authenticateAdmin, async (req, res) => {
  try {
    console.log("Admin fetched users (admin route)");
    const users = await User.find().select("username email createdAt").lean();
    if (users.length === 0) {
      console.log("No users found");
      return res.status(204).json([]);
    }
    console.log("Users fetched (admin route):", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users (admin route):", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
