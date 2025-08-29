const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  snippets: { type: Number, default: 0 },
  color: { type: String },
});

module.exports = mongoose.model("Language", languageSchema);
