const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const languageRoutes = require("./routes/languages");
const categoryRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const snippetsRoutes = require("./routes/snippets");
const Language = require("./models/Language");
const Category = require("./models/Category");
const Snippet = require("./models/Snippet");
const User = require("./models/User");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", languageRoutes);
app.use("/api", categoryRoutes);
app.use("/api", usersRoutes);
app.use("/api", snippetsRoutes);

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

app.get("/api/stats", async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const languagesCount = await Language.countDocuments();
    const categoriesCount = await Category.countDocuments();
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

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
