const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    const languageSchema = new mongoose.Schema({
      name: { type: String, required: true, unique: true },
      snippets: { type: Number, default: 0 },
      color: { type: String },
    });
    const Language = mongoose.model("Language", languageSchema);

    const categorySchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String },
      languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
      },
    });
    const Category = mongoose.model("Category", categorySchema);

    const languages = await Language.find();
    const defaultCategories = languages.flatMap((lang) => [
      {
        name: "Login Page",
        description: "Customizable login form designs",
        languageId: lang._id,
      },
      {
        name: "Homepage",
        description: "Responsive homepage layouts",
        languageId: lang._id,
      },
      {
        name: "Register Page",
        description: "User registration form designs",
        languageId: lang._id,
      },
    ]);

    await Category.deleteMany({}); // Clear existing categories (optional)
    await Category.insertMany(defaultCategories);
    console.log("Default categories seeded for all languages");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error:", err);
    mongoose.connection.close();
  });
