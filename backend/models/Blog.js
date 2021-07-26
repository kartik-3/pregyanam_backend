const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Slot Model Definition
const blogSchema = new Schema({
  title: { type: String },
  description: { type: String },
  content: { type: String },
  cover: { type: String },
  creator: { type: mongoose.Types.ObjectId, ref: "Admin" },
  tags: { type: String },
  draft: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("Blog", blogSchema);
