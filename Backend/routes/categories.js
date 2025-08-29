const express = require("express");
const Category = require("../models/Category");
const Language = require("../models/Language");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Get categories by language name
router.get("/languages/:languageName/categories", async (req, res) => {
  try {
    const language = await Language.findOne({
      name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
    });
    if (!language) {
      console.log(`Language not found for name: ${req.params.languageName}`);
      return res.status(404).json({ error: "Language not found" });
    }
    const categories = await Category.find({ languageId: language._id });
    console.log(
      `Fetched categories for ${req.params.languageName}:`,
      categories
    );
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin: Get categories by language name
router.get(
  "/admin/languages/:languageName/categories",
  authenticateAdmin,
  async (req, res) => {
    try {
      const language = await Language.findOne({
        name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }
      const categories = await Category.find({ languageId: language._id });
      console.log(
        `Admin fetched categories for ${req.params.languageName}:`,
        categories
      );
      res.json(categories);
    } catch (error) {
      console.error("Admin get categories error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Add category
router.post(
  "/admin/languages/:languageName/categories",
  authenticateAdmin,
  async (req, res) => {
    const { name, description } = req.body;
    try {
      const language = await Language.findOne({
        name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }
      const category = new Category({
        name,
        description,
        languageId: language._id,
        languageName: language.name,
      });
      await category.save();
      console.log("Added category:", category);
      res.status(201).json(category);
    } catch (error) {
      console.error("Add category error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Update category
router.put(
  "/admin/languages/:languageName/categories/:categoryId",
  authenticateAdmin,
  async (req, res) => {
    const { name, description } = req.body;
    try {
      const language = await Language.findOne({
        name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        console.log(`Category not found: ${req.params.categoryId}`);
        return res.status(404).json({ error: "Category not found" });
      }
      if (category.languageId.toString() !== language._id.toString()) {
        console.log(
          `Category ${req.params.categoryId} does not belong to language ${req.params.languageName}`
        );
        return res
          .status(400)
          .json({ error: "Category does not belong to this language" });
      }
      category.name = name || category.name;
      category.description = description || category.description;
      await category.save();
      console.log("Updated category:", category);
      res.json(category);
    } catch (error) {
      console.error("Update category error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Delete category
router.delete(
  "/admin/languages/:languageName/categories/:categoryId",
  authenticateAdmin,
  async (req, res) => {
    try {
      const language = await Language.findOne({
        name: new RegExp(`^${req.params.languageName}$`, "i"),
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }
      const category = await Category.findById(req.params.categoryId);
      if (!category) {
        console.log(`Category not found: ${req.params.categoryId}`);
        return res.status(404).json({ error: "Category not found" });
      }
      if (category.languageId.toString() !== language._id.toString()) {
        console.log(
          `Category ${req.params.categoryId} does not belong to language ${req.params.languageName}`
        );
        return res
          .status(400)
          .json({ error: "Category does not belong to this language" });
      }
      await category.deleteOne();
      console.log("Deleted category:", req.params.categoryId);
      res.json({ message: "Category deleted" });
    } catch (error) {
      console.error("Delete category error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
