const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Service Model Definition
const serviceSchema = new Schema({
  name: { type: String },
  code: { type: String },
  price: { type: Number },
  userPerSlot: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("Service", serviceSchema);
