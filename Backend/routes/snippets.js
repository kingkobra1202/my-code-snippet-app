const express = require("express");
const Snippet = require("../models/Snippet");
const Category = require("../models/Category");
const Language = require("../models/Language");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

// Get snippets by language name and category name
router.get(
  "/languages/:languageName/categories/:categoryName/snippets",
  async (req, res) => {
    try {
      const language = await Language.findOne({
        name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }

      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${req.params.categoryName}$`, "i") },
        languageId: language._id,
      });
      if (!category) {
        console.log(`Category not found for name: ${req.params.categoryName}`);
        return res.status(404).json({ error: "Category not found" });
      }

      const snippets = await Snippet.find({ categoryId: category._id });
      console.log(
        `Fetched snippets for ${req.params.languageName}/${req.params.categoryName}:`,
        snippets
      );
      res.json(snippets);
    } catch (error) {
      console.error("Get snippets error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Get snippets by language name and category name
router.get(
  "/admin/languages/:languageName/categories/:categoryName/snippets",
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

      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${req.params.categoryName}$`, "i") },
        languageId: language._id,
      });
      if (!category) {
        console.log(`Category not found for name: ${req.params.categoryName}`);
        return res.status(404).json({ error: "Category not found" });
      }

      const snippets = await Snippet.find({ categoryId: category._id });
      console.log(
        `Admin fetched snippets for ${req.params.languageName}/${req.params.categoryName}:`,
        snippets
      );
      res.json(snippets);
    } catch (error) {
      console.error("Admin get snippets error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Add snippet
router.post(
  "/admin/languages/:languageName/categories/:categoryName/snippets",
  authenticateAdmin,
  async (req, res) => {
    const { title, description, code, previewImage, demoLink } = req.body;
    try {
      const language = await Language.findOne({
        name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }

      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${req.params.categoryName}$`, "i") },
        languageId: language._id,
      });
      if (!category) {
        console.log(`Category not found for name: ${req.params.categoryName}`);
        return res.status(404).json({ error: "Category not found" });
      }

      const snippet = new Snippet({
        title,
        description,
        code,
        languageId: language._id,
        languageName: language.name,
        categoryId: category._id,
        categoryName: category.name,
        previewImage: previewImage || "",
        demoLink: demoLink || "",
      });

      await snippet.save();
      console.log("Added snippet:", snippet);
      res.status(201).json(snippet);
    } catch (error) {
      console.error("Add snippet error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Update snippet
router.put(
  "/admin/languages/:languageName/categories/:categoryName/snippets/:snippetId",
  authenticateAdmin,
  async (req, res) => {
    const { title, description, code, previewImage, demoLink } = req.body;
    try {
      const language = await Language.findOne({
        name: { $regex: new RegExp(`^${req.params.languageName}$`, "i") },
      });
      if (!language) {
        console.log(`Language not found for name: ${req.params.languageName}`);
        return res.status(404).json({ error: "Language not found" });
      }

      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${req.params.categoryName}$`, "i") },
        languageId: language._id,
      });
      if (!category) {
        console.log(`Category not found for name: ${req.params.categoryName}`);
        return res.status(404).json({ error: "Category not found" });
      }

      const snippet = await Snippet.findById(req.params.snippetId);
      if (!snippet) {
        console.log(`Snippet not found: ${req.params.snippetId}`);
        return res.status(404).json({ error: "Snippet not found" });
      }

      if (snippet.categoryId.toString() !== category._id.toString()) {
        console.log(
          `Snippet ${req.params.snippetId} does not belong to category ${req.params.categoryName}`
        );
        return res
          .status(400)
          .json({ error: "Snippet does not belong to this category" });
      }

      snippet.title = title || snippet.title;
      snippet.description = description || snippet.description;
      snippet.code = code || snippet.code;
      snippet.previewImage = previewImage || snippet.previewImage;
      snippet.demoLink = demoLink || snippet.demoLink;

      await snippet.save();
      console.log("Updated snippet:", snippet);
      res.json(snippet);
    } catch (error) {
      console.error("Update snippet error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Admin: Delete snippet
router.delete(
  "/admin/languages/:languageName/categories/:categoryName/snippets/:snippetId",
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

      const category = await Category.findOne({
        name: { $regex: new RegExp(`^${req.params.categoryName}$`, "i") },
        languageId: language._id,
      });
      if (!category) {
        console.log(`Category not found for name: ${req.params.categoryName}`);
        return res.status(404).json({ error: "Category not found" });
      }

      const snippet = await Snippet.findById(req.params.snippetId);
      if (!snippet) {
        console.log(`Snippet not found: ${req.params.snippetId}`);
        return res.status(404).json({ error: "Snippet not found" });
      }

      if (snippet.categoryId.toString() !== category._id.toString()) {
        console.log(
          `Snippet ${req.params.snippetId} does not belong to category ${req.params.categoryName}`
        );
        return res
          .status(400)
          .json({ error: "Snippet does not belong to this category" });
      }

      await snippet.deleteOne();
      console.log("Deleted snippet:", req.params.snippetId);
      res.json({ message: "Snippet deleted" });
    } catch (error) {
      console.error("Delete snippet error:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
