const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// SlotBooking Model Definition
const slotBookingSchema = new Schema({
  bookedAt: { type: Date },
  service: { type:  mongoose.Types.ObjectId, ref: 'Service' },
  slot: { type: mongoose.Types.ObjectId, ref: "Slot" },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export Module/Schema
module.exports = mongoose.model("SlotBooking", slotBookingSchema);
