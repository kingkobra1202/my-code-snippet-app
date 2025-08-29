const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Client, Storage, ID } = require("appwrite");
const fileUpload = require("express-fileupload");

const authRoutes = require("./routes/auth");
const languageRoutes = require("./routes/languages");
const categoryRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const snippetsRoutes = require("./routes/snippets");
const Language = require("./models/Language");
const Category = require("./models/Category");
const Snippet = require("./models/Snippet");
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Configure Appwrite
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID);

// For server-side authentication, we need to use the API key directly
const storage = new Storage(client, process.env.APPWRITE_API_KEY);

// New route for image uploads to Appwrite
app.post("/api/upload-image", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const file = req.files.image;

    // Upload the file to Appwrite Storage
    const uploadedFile = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID,
      ID.unique(),
      file.data // Use file data (Buffer) instead of file path
    );

    // Get the file's URL
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

    res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error("Error uploading image to Appwrite:", err);
    res.status(500).json({ error: "Failed to upload image." });
  }
});

// Routes
app.use("/api", authRoutes);
app.use("/api", languageRoutes);
app.use("/api", categoryRoutes);
app.use("/api", usersRoutes);
app.use("/api", snippetsRoutes);

// Route to get a single snippet by ID
app.get("/api/snippets/:snippetId", async (req, res) => {
  try {
    const { snippetId } = req.params;
    const snippet = await Snippet.findById(snippetId);

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    res.json(snippet);
  } catch (error) {
    console.error("Error fetching snippet:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Stats endpoint
app.get("/api/stats", async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const languagesCount = await Language.countDocuments();
    const categoriesCount = await Category.countDocuments();
    console.log("Stats fetched:", {
      users: usersCount,
      languages: languagesCount,
      snippets: categoriesCount * 100,
    });
    res.json({
      users: usersCount,
      languages: languagesCount,
      snippets: categoriesCount * 100,
    });
  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Catch-all route for invalid endpoints
app.use((req, res) => {
  console.log(`Invalid route accessed: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
