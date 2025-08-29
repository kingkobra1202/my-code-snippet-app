const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const languageRoutes = require("./routes/languages");
const categoryRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const Language = require("./models/Language");
const Category = require("./models/Category");
const User = require("./models/User");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/api", languageRoutes);
app.use("/api", categoryRoutes);
app.use("/api", usersRoutes);

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
      snippets: categoriesCount * 100, // Placeholder: Adjust based on actual snippets
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

// Seed initial languages (run once)
const seedLanguages = async () => {
  try {
    const existingLanguages = await Language.countDocuments();
    if (existingLanguages === 0) {
      const initialLanguages = [
        {
          name: "React",
          snippets: 200,
          color: "from-indigo-500 to-purple-600",
        },
        {
          name: "HTML & CSS",
          snippets: 150,
          color: "from-orange-500 to-yellow-600",
        },
        { name: "Flutter", snippets: 100, color: "from-cyan-500 to-teal-600" },
        {
          name: "Python",
          snippets: 300,
          color: "from-emerald-500 to-green-600",
        },
      ];
      const languages = await Language.insertMany(initialLanguages);
      console.log("Languages seeded:", languages);

      const defaultCategories = languages.flatMap((lang) => [
        {
          name: "Login Page",
          description: "Customizable login form designs",
          languageId: lang._id,
          languageName: lang.name,
        },
        {
          name: "Homepage",
          description: "Responsive homepage layouts",
          languageId: lang._id,
          languageName: lang.name,
        },
        {
          name: "Register Page",
          description: "User registration form designs",
          languageId: lang._id,
          languageName: lang.name,
        },
        {
          name: "Searchbar",
          description: "Interactive search bar components",
          languageId: lang._id,
          languageName: lang.name,
        },
      ]);
      await Category.insertMany(defaultCategories);
      console.log("Categories seeded");
    } else {
      console.log("Languages already exist, skipping seeding");
    }
  } catch (error) {
    console.error("Seeding error:", error.message);
  }
};
seedLanguages();

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
