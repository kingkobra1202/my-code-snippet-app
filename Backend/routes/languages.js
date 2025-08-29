const express = require("express");
const Language = require("../models/Language");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Get all languages
router.get("/languages", async (req, res) => {
  try {
    const languages = await Language.find();
    console.log("Fetched languages:", languages);
    res.json(languages);
  } catch (error) {
    console.error("Get languages error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get all languages
router.get("/admin/languages", authenticateAdmin, async (req, res) => {
  try {
    const languages = await Language.find();
    console.log("Admin fetched languages:", languages);
    res.json(languages);
  } catch (error) {
    console.error("Admin get languages error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Add language
router.post("/admin/languages", authenticateAdmin, async (req, res) => {
  const { name, color } = req.body;
  try {
    const language = new Language({ name, color, snippets: 0 });
    await language.save();
    console.log("Added language:", language);
    res.status(201).json(language);
  } catch (error) {
    console.error("Add language error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Update language
router.put("/admin/languages/:id", authenticateAdmin, async (req, res) => {
  const { name, color } = req.body;
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      console.log(`Language not found: ${req.params.id}`);
      return res.status(404).json({ error: "Language not found" });
    }
    language.name = name || language.name;
    language.color = color || language.color;
    await language.save();
    console.log("Updated language:", language);
    res.json(language);
  } catch (error) {
    console.error("Update language error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Delete language
router.delete("/admin/languages/:id", authenticateAdmin, async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) {
      console.log(`Language not found: ${req.params.id}`);
      return res.status(404).json({ error: "Language not found" });
    }
    await language.deleteOne();
    console.log("Deleted language:", req.params.id);
    res.json({ message: "Language deleted" });
  } catch (error) {
    console.error("Delete language error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
