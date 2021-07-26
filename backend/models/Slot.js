const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Slot Model Definition
const slotSchema = new Schema({
  date: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  service: { type:  mongoose.Types.ObjectId, ref: 'Service' },
  admin: { type: mongoose.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("Slot", slotSchema);
