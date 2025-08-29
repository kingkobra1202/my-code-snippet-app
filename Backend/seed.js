const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Language = require("./models/Language");
const Category = require("./models/Category");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const seedLanguages = async () => {
  try {
    // Clear existing data
    await Language.deleteMany({});
    await Category.deleteMany({});

    const initialLanguages = [
      { name: "React", snippets: 200, color: "from-indigo-500 to-purple-600" },
      {
        name: "HTML & CSS",
        snippets: 150,
        color: "from-orange-500 to-yellow-600",
      },
      { name: "Flutter", snippets: 100, color: "from-cyan-500 to-teal-600" },
      { name: "Python", snippets: 300, color: "from-emerald-500 to-green-600" },
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

    mongoose.connection.close();
  } catch (error) {
    console.error("Seeding error:", error);
    mongoose.connection.close();
  }
};

seedLanguages();
