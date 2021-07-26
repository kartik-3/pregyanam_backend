const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Admin Service Model Definition
const adminServiceSchema = new Schema({
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  service: { type: mongoose.Types.ObjectId, ref: "Service" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("AdminService", adminServiceSchema);
