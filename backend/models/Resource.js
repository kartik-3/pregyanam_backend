const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Slot Model Definition
const resourceSchema = new Schema({
  name: { type: String },
  url: { type: String },
  description: { type: String },
  type: { type: String }, //BOOK, VIDEO
  price: { type: Number, default: 0 },
  creator: { type: mongoose.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("Resource", resourceSchema);
